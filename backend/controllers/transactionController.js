const { db } = require('../config/firebase');
const { OpenAI } = require('openai');

const isGroq = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('gsk_');
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
  baseURL: isGroq ? "https://api.groq.com/openai/v1" : undefined
});
const AI_MODEL = isGroq ? "llama-3.1-8b-instant" : "gpt-3.5-turbo";

exports.autoCategorize = async (req, res) => {
  const { title } = req.body;
  
  if (!title) return res.status(400).json({ error: "Title is required" });

  if (!process.env.OPENAI_API_KEY) {
    // Basic mock fallback if no API key is set
    const lower = title.toLowerCase();
    let cat = "Others";
    let sub = "General";
    
    if (lower.includes('amazon') || lower.includes('clothes') || lower.includes('shoe')) { cat = "Shopping"; sub = "General"; }
    else if (lower.includes('food') || lower.includes('pizza') || lower.includes('snack') || lower.includes('biriyani') || lower.includes('burger') || lower.includes('restaurant')) { cat = "Food & Dining"; sub = "Restaurants"; }
    else if (lower.includes('movie') || lower.includes('netflix')) { cat = "Entertainment"; sub = "Subscriptions"; }
    
    return res.json({ category: cat, subcategory: sub });
  }

  try {
    const prompt = `You are an intelligent expense categorization assistant.
    
Classify the expense into a category and subcategory.

Categories:
1. Food & Dining (Groceries, Restaurants, Snacks)
2. Transportation (Fuel, Cab, Public Transport)
3. Shopping (Clothes, Electronics, General)
4. Bills & Utilities (Electricity, Internet, Mobile Recharge)
5. Entertainment (Movies, Games, Subscriptions)
6. Health (Medicines, Doctor)
7. Education (Fees, Books)
8. Travel (Flights, Hotels)
9. Others

Return output ONLY in JSON format:
{
  "category": "",
  "subcategory": ""
}

Expense: "${title}"`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });
    
    // Parse the JSON output safely
    const responseText = completion.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(responseText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to categorize", details: error.message });
  }
};
global.mockTransactions = global.mockTransactions || [];

exports.getTransactions = async (req, res) => {
  try {
    if (req.user.uid === 'demo-123') {
      return res.json([...global.mockTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    const snapshot = await db.collection('transactions')
      .where('userId', '==', req.user.uid)
      .get();
      
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addTransaction = async (req, res) => {
  const { title, amount, category, subcategory, type, date } = req.body;
  try {
    const txData = {
      userId: req.user.uid,
      title,
      amount: parseFloat(amount),
      category,
      subcategory: subcategory || '',
      type, // 'income' or 'expense'
      date: new Date(date).toISOString(),
      createdAt: new Date().toISOString()
    };
    
    if (req.user.uid === 'demo-123') {
      const mockId = Math.random().toString(36).substr(2, 9);
      global.mockTransactions.push({ id: mockId, ...txData });
      return res.status(201).json({ id: mockId, message: 'Transaction added successfully (Mock)' });
    }

    const docRef = await db.collection('transactions').add(txData);
    res.status(201).json({ id: docRef.id, message: 'Transaction added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    if (req.user.uid === 'demo-123') {
      global.mockTransactions = global.mockTransactions.filter(t => t.id !== req.params.id);
      return res.json({ message: 'Transaction deleted successfully (Mock)' });
    }
    await db.collection('transactions').doc(req.params.id).delete();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    let transactions = [];
    if (req.user.uid === 'demo-123') {
      transactions = [...global.mockTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      const snapshot = await db.collection('transactions')
        .where('userId', '==', req.user.uid)
        .get();
      transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};
    const chartDataMap = {};
    
    transactions.forEach(tx => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
      
      const dateKey = tx.date.split('T')[0];
      if (!chartDataMap[dateKey]) chartDataMap[dateKey] = { date: dateKey, income: 0, expense: 0 };
      
      chartDataMap[dateKey][tx.type] += tx.amount;
    });

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Get last 30 days
    const chartData = Object.values(chartDataMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      summary: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense
      },
      transactions: transactions.slice(0, 5), // last 5
      allTransactions: transactions,
      chartData: chartData.slice(-30),
      categoryData
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
