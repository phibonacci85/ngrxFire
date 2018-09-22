const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const twilio = require('twilio');
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const accountSid = "AC693e5d428bf752db0cac9d6f8594544d";
const authToken = "abebe7c469ecb91f2c451894d0a4d539";

const client = new twilio(accountSid, authToken);
const twilioNumber = '+15152079747';
exports.textMessage = functions.firestore
  .document('/orders/{orderKey}/status')
  .onUpdate((change, context) => {
    const orderKey = context.params.orderKey;
    return admin.firestore()
      .doc(`/orders/${orderKey}`)
      .get()
      .then(order => {
        const status = order.status;
        const phoneNumber = order.phoneNumber;
        if (!validE164(phoneNumber)) {
          throw new Error('number must be E164 format');
        }
        const textMessage = {
          body: `Current order status: ${status}`,
          to: phoneNumber,
          from: twilioNumber,
        };
        return client.messages.create(textMessage);
      })
      .then(message => console.log(message.sid, 'success'))
      .catch(err => console.log(err));
  });

exports.textStatus = functions.database
  .ref('/orders/{orderKey}/status')
  .onUpdate(event => {
    const orderKey = event.params.orderKey;
    return admin.database()
      .ref(`/orders/${orderKey}`)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(order => {
        const status = order.status;
        const phoneNumber = order.phoneNumber;
        if (!validE164(phoneNumber)) {
          throw new Error('number must be E164 format');
        }
        const textMessage = {
          body: `Current order status: ${status}`,
          to: phoneNumber,
          from: twilioNumber,
        };
        return client.messages.create(textMessage);
      })
      .then(message => console.log(message.sid, 'success'))
      .catch(err => console.log(err));
  });

function validE164(num) {
  return /^\+?[1-9]\d{1,14}$/.test(num)
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
