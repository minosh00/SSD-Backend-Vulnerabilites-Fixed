const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);


app.get("/" , (req,res)=>{
  res.json("server has started")
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dotenv = require("dotenv");
dotenv.config();

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

app.listen(PORT, () => {
  console.log(`Backend App is running on ${PORT}`);
});