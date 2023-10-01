const mongoose = require("mongoose");

const EmployeeSchema = mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    JobPosition: { type: String, required: true },
    gender: { type: String, required: true },
    HomeAddress: { type: String, required: true },
    email: { type: String, required: true },
    Pnumber: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
