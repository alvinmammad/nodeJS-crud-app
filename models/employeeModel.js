const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An employee must have a name"],
    },
    surname: {
      type: String,
      required: [true, "An employee must have a surname"],
    },
    age: {
      type: Number,
      required: [true, "An employee must have age"],
    },
    salary: {
      type: Number,
      required: [true, "An employee must have monthly salary"],
    },
    phone: {
      type: String,
      required: [true, "An employee must have a phone number"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique:true,
      lowercase:true,
      validate:[validator.isEmail,"Please provide a valid email"]
    },

    position: {
      type: mongoose.Schema.ObjectId,
      ref: "Position",
      required: [true, "Employee must belong to a position"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
employeeSchema.pre("/^find/", function (next) {
  this.populate({
    path: "position",
    select: "name",
  }).next();
});
employeeSchema.pre('save',function(){
  this.populate({
    path: "position",
    select: "name",
  })
})
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
