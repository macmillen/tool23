import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://verleihapp.firebaseio.com"
});

export const fireFirestore = app.firestore();
export const fireAuth = app.auth();
export const fireMessaging = app.messaging();
