const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan"); // Added morgan for request logging
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 5000;

// Remove the X-Powered-By header
app.disable("x-powered-by");

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();

// Request logging middleware
app.use(morgan("dev")); // Use "dev" format for request logging


//import Routes 
app.use("/api",  require("./routes/usersRoutes"));
app.use("/api", require("./routes/roomRoutes"));
app.use("/api", require("./routes/employeeRoutes"));
app.use('/api', require('./routes/commentRoutes'));
app.use('/api', require('./routes/bookingRoutes'));
app.use('/api', require('./routes/supplierRoutes'));
app.use("/api", require("./Routes/foodRoutes"));
app.use("/api", require("./Routes/orderRoutes"));


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
