const { admin } = require('./config/firebase');

async function listUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers(100);
    listUsersResult.users.forEach((userRecord) => {
      console.log('user', userRecord.uid, userRecord.email, userRecord.displayName);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
}
listUsers();
