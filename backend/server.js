const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan"); // Added morgan for request logging
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();

// Request logging middleware
app.use(morgan("dev")); // Use "dev" format for request logging


//import Routes 
app.use("/user",  require("./routes/Userroutes"));
app.use("/room", require("./routes/Room.Routes"));
app.use("/employee", require("./routes/Employee.Routes"));
app.use('/api', require('./routes/Comment.Routes'));
app.use('/book', require('./routes/Booking.Routes'));
app.use('/supplier', require('./routes/Supplier.route'));
app.use("/menu", require("./Routes/food.routes"));
app.use("/orders", require("./Routes/orders"));


mongoose.connect(
  process.env.DB_URL, {
  //type warnings
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Mongo DB Connected Successfully");
  })
  .catch((err) => console.log("DB Connection Failed", err));

  // Implement security logging and monitoring
// Log important security events and activities
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from ${req.ip}`);
  // You can customize this log format to capture more security-related information
  next();
});

app.listen(PORT, () => {
  console.log(`Backend App is running on ${PORT}`);
});
