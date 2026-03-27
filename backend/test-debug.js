const fs = require('fs');
const { admin, db } = require('./config/firebase');

async function debugAll() {
  try {
    const listUsersResult = await admin.auth().listUsers(100);
    const users = listUsersResult.users.map(u => ({ uid: u.uid, email: u.email }));
    
    const snapshot = await db.collection('transactions').get();
    const tx = [];
    snapshot.forEach(doc => tx.push({ id: doc.id, ...doc.data() }));

    const result = { users, txCount: tx.length, tx };
    fs.writeFileSync('debug.json', JSON.stringify(result, null, 2), 'utf8');
    
    console.log('Wrote to debug.json successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugAll();
