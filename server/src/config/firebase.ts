import * as admin from 'firebase-admin';

// import firebase credentials
const serviceAccount = require('../../serviceAccountKey.json');

/**
 * initialize the firebase application
 */
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://verleihapp.firebaseio.com"
});

// export different firebase services to use them across the application
export const fireFirestore = app.firestore();
export const fireAuth = app.auth();
export const fireMessaging = app.messaging();
