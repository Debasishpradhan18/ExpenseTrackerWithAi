const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

const checkData = async () => {
  try {
    // Connect to your local database
    await mongoose.connect('mongodb://127.0.0.1:27017/smart-expense-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n--- 👥 USERS IN DATABASE ---');
    const users = await User.find({}).select('-password'); // Exclude password hashes
    if (users.length === 0) {
        console.log("No users found.");
    } else {
        users.forEach(user => {
            console.log(`- ID: ${user._id} | Name: ${user.name} | Email: ${user.email}`);
        });
    }

    console.log('\n--- 💳 TRANSACTIONS IN DATABASE ---');
    const transactions = await Transaction.find({});
    if (transactions.length === 0) {
        console.log("No transactions found.");
    } else {
        transactions.forEach(tx => {
            // Find which user this transaction belongs to mapping by User ID
            const owner = users.find(u => u._id.toString() === tx.userId.toString());
            const ownerName = owner ? owner.name : 'Unknown User';
            
            console.log(`- [${ownerName}] Date: ${new Date(tx.date).toLocaleDateString()} | ${tx.type.toUpperCase()} | ${tx.title} | $${tx.amount} | Cat: ${tx.category}`);
        });
    }

    console.log('\n✅ Data check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking data:', error);
    process.exit(1);
  }
};

checkData();
