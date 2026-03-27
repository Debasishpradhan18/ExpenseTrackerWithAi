const admin = require('firebase-admin');

const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

try {
  if (fs.existsSync(serviceAccountPath)) {
    console.log("Firebase Admin: Found serviceAccountKey.json. Initializing securely.");
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath))
    });
  } else {
    console.warn("Firebase Admin: No serviceAccountKey.json found. Trying default credentials.");
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
} catch (error) {
  // Graceful fallback for development if ADC isn't set
  console.log("Firebase Admin SDK initialize fallback...");
  if (!admin.apps.length) {
    admin.initializeApp();
  }
}

const db = admin.firestore();

module.exports = { admin, db };
