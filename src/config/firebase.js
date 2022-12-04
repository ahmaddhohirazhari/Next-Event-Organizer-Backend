const admin = require("firebase-admin");

const serviceAccount = require("./next-event-organizing-firebase-adminsdk-3874l-9306c10172.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
