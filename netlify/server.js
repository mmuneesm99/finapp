// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authHelpers = require("../helpers/auth");
const userController = require("../controllers/userController");
const transactionController = require("../controllers/transactionController");
const customerController = require("../controllers/customerController");
const orderController = require("../controllers/orderController");
const dashboardController = require("../controllers/dashboardController");
const cors = require("cors");
const emailController = require("../controllers/emailController");
const smsController = require("../controllers/smsController");
const serverless = require('serverless-http');

require("dotenv").config();
const app = express();
const port = 2000;

app.use(
  cors({
    origin: "http://localhost:8080", // Replace with your frontend's origin URL
    allowedHeaders: ["Content-Type", "Authorization"], // Add any additional headers you want to allow
  })
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    "mongodb+srv://munees:FKqh2rPzFRBlRzQR@hexpeak.cpln38x.mongodb.net/?retryWrites=true&w=majority&appName=hexpeak",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Routes
// app.use(authHelpers.authenticateToken);
app.get("/",(req,res)=>{
  res.send("app is running")
});
app.post(
  "/register",
  userController.registerUser
);

app.post("/login", userController.loginUser);
app.post("/admin-login", userController.adminLogin);
app.post("/get-users", userController.getUsers);
app.post("/getuser", userController.getUserbyId);
app.post("/delete-user", userController.deleteUserbyId);
app.post("/update/:id", userController.updateUser);
app.post("/update-payment/:id", userController.updatePayment);
app.get("/protected", authHelpers.authenticateToken, (req, res) => {
  // Access the authenticated user using req.user
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});
app.post("/get-customers", customerController.getCustomers);
app.post("/add-transactions", transactionController.addTransaction);
app.post("/get-transactions", transactionController.getTransaction);
app.post("/get-transactions/:id", transactionController.getTransactionById);
app.post("/create-payment", transactionController.createPayment);
app.post("/create-paymentintent", transactionController.createPaymentIntent);
app.post("/payment-confirm", transactionController.addTransaction);
app.post(
  "/delete-transactions/:id",
  transactionController.deleteTransactionById
);
app.post('/createCustomer', customerController.addCustomer);
app.post('/customer/:userId', customerController.getCustomerById)
app.post("/dashboard-data", dashboardController.getDashBoardData);
app.post('/send-email', emailController.sendEmail);
app.post('/sendSMS', (req, res) => {
  const { to, message } = req.body;

  smsController.sendSMS(to, message)
    .then(message => {
      console.log('Message sent! SID:', message.sid);
      res.send('Message sent successfully!');
    })
    .catch(error => {
      console.error('Error sending message:', error);
      res.status(500).send('Failed to send message');
    });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.post("/get-orders", orderController.getOrders);
app.post("/get-staff-orders", orderController.getOrderByStaffId);
// app.post("/total-amount", orderController.getTotalAmountByPaymentType);
app.use('/.netlify/functions/server', app);

module.exports.handler = serverless(app);