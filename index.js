/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const routerNavigation = require("./src/routes"); //

const serviceAccount = require("./src/config/next-event-organizing-firebase-adminsdk-3874l-9306c10172.json");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", routerNavigation);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/payment", (req, res) => {
  const dataUser = {
    fullName: "Naruto",
  };

  const dataTransaction = {
    amount: "Rp 5000",
  };

  const condition = "'stock-GOOG' in topics || 'industry-tech' in topics";

  const message = {
    notification: {
      title: `payment success, kamu udah ngirim ke ${dataUser.fullName}`,
      body: `kamu mengirim sebesar${dataTransaction.amount}`,
    },
    condition,
  };

  // Send a message to devices subscribed to the combination of topics
  // specified by the provided condition.
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

app.use("/*", (req, res) => {
  res.status(404).send("Path Not Found !");
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is Running on port ${port}`);
});
