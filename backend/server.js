const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan"); // Added morgan for request logging
const dotenv = require("dotenv");
const helmet = require("helmet"); // Added for security headers
const rateLimit = require("express-rate-limit"); // Added for rate limiting
const csrf = require('csurf'); // Added for CSRF protection

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

// Apply security headers using helmet
app.use(helmet());

// Implement rate limiting for specific routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
app.use(apiLimiter);

// Enable CSRF protection
app.use(csrf());

// Error logging middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  // You can log additional information or take other actions as needed
  res.status(500).json({ error: "Internal Server Error" });
});

// Make the CSRF token available to your views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Import Routes
app.use("/api", require("./routes/usersRoutes"));
app.use("/api", require("./routes/roomRoutes"));
app.use("/api", require("./routes/employeeRoutes"));
app.use("/api", require("./routes/commentRoutes"));
app.use("/api", require("./routes/bookingRoutes"));
app.use("/api", require("./routes/supplierRoutes"));
app.use("/api", require("./Routes/foodRoutes"));
app.use("/api", require("./Routes/orderRoutes"));

mongoose
  .connect(process.env.DB_URL, {
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
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} from ${req.ip}`
  );
  // You can customize this log format to capture more security-related information
  next();
});

app.listen(PORT, () => {
  console.log(`Backend App is running on ${PORT}`);
});
