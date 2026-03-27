const { db } = require('./config/firebase');

async function check() {
  try {
    const snapshot = await db.collection('transactions').get();
    console.log(`Total transactions in DB: ${snapshot.size}`);
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
check();
