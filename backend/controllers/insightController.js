const { db } = require('../config/firebase');
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
    const { message } = req.body;
    return res.json({ reply: "I am an AI assistant. How can I help you regarding your finances today?" });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Failed to process chat request.' });
  }
};
