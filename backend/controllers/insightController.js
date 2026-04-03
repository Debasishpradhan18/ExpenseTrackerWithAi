const { db } = require('../config/firebase');
const { OpenAI } = require('openai');

const isGroq = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('gsk_');
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
  baseURL: isGroq ? "https://api.groq.com/openai/v1" : undefined
});
const AI_MODEL = isGroq ? "llama-3.1-8b-instant" : "gpt-3.5-turbo";

exports.getInsights = async (req, res) => {
  try {
    let expenses = [];
    if (req.user.uid === 'demo-123') {
      global.mockTransactions = global.mockTransactions || [];
      expenses = global.mockTransactions.filter(t => t.type === 'expense');
    } else {
      const snapshot = await db.collection('transactions')
        .where('userId', '==', req.user.uid)
        .where('type', '==', 'expense')
        .get();
        
      expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    // Aggregate by category locally
    const categories = {};
    let totalExpense = 0;
    expenses.forEach(ex => {
      categories[ex.category] = (categories[ex.category] || 0) + parseFloat(ex.amount);
      totalExpense += parseFloat(ex.amount);
    });

    // Pure local analysis without external APIs
    const highlights = [];
    if (Object.keys(categories).length > 0) {
      const topCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
       highlights.push({
        type: 'warning',
        title: `High spend on ${topCategory}`,
        description: `You've spent ₹${categories[topCategory].toFixed(2)} on ${topCategory}. Try to reduce this by 10% next month.`
      });
    }
    
    if (totalExpense > 5000) {
      highlights.push({
        type: 'warning',
        title: 'Budget Alert',
        description: `Your expenses are very high (₹${totalExpense.toFixed(2)}). Consider setting stricter category limits.`
      });
    } else if (totalExpense > 0) {
      highlights.push({
        type: 'positive',
        title: 'Good Spending Habits',
        description: 'You are keeping your expenses under control this period. Keep it up!'
      });
    }

    if (highlights.length === 0) {
      highlights.push({
        type: 'info',
        title: 'Welcome to Smart Insights',
        description: 'Add your first transaction on the Transactions page to unlock deeper custom financial analysis.'
      });
    }

    // Calculate spend change and savings opportunity
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let thisMonthExpense = 0;
    let lastMonthExpense = 0;
    
    expenses.forEach(ex => {
      if (!ex.date) return;
      const exDate = new Date(ex.date);
      const exMonth = exDate.getMonth();
      const exYear = exDate.getFullYear();
      
      if (exYear === currentYear && exMonth === currentMonth) {
        thisMonthExpense += parseFloat(ex.amount) || 0;
      } else if ((exYear === currentYear && exMonth === currentMonth - 1) || (currentMonth === 0 && exYear === currentYear - 1 && exMonth === 11)) {
        lastMonthExpense += parseFloat(ex.amount) || 0;
      }
    });

    const spendChange = thisMonthExpense - lastMonthExpense;
    
    // Suggest 10% of expenses as savings opportunity
    let savingsOpportunity = 0;
    if (thisMonthExpense > 0) {
      savingsOpportunity = thisMonthExpense * 0.10;
    } else if (totalExpense > 0) {
      // Fallback if there are expenses but none match the current month's date
      savingsOpportunity = totalExpense * 0.10;
    }

    return res.json({
      spendChange,
      savingsOpportunity,
      highlights
    });

  } catch (error) {
    console.error('Insights generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate insights' });
  }
};

exports.postChat = async (req, res) => {
  try {
    const { message, transactions = [] } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OpenAI API key is missing. Please configure it in your environment variables to use real AI analysis." });
    }

    // Summarize data for AI
    let totalIncome = 0;
    let totalExpense = 0;
    const catMap = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += parseFloat(t.amount);
      } else {
        totalExpense += parseFloat(t.amount);
        const cat = t.category || 'Other';
        catMap[cat] = (catMap[cat] || 0) + parseFloat(t.amount);
      }
    });

    const summary = `
Total Income: ₹${totalIncome.toFixed(2)}
Total Expense: ₹${totalExpense.toFixed(2)}
Expense Categories Breakdown:
${Object.entries(catMap).map(([k, v]) => `- ${k}: ₹${v.toFixed(2)}`).join('\n')}
    `;

    const systemPrompt = `You are a smart financial assistant. Analyze the user's transaction data and answer their questions in a simple, helpful, and human-friendly way. Give actionable advice. Keep responses short and clear.

User's Financial Summary:
${summary}

Recent Transactions Context (up to last 10):
${JSON.stringify(transactions.slice(0, 10).map(t => ({ amount: t.amount, type: t.type, category: t.category, date: t.date.split('T')[0] })))}
    `;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.5,
    });

    const aiMessage = completion.choices[0].message.content;
    
    return res.json({ reply: aiMessage });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Failed to process chat request.', details: error.message });
  }
};
