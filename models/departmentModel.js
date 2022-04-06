const mongoose = require("mongoose");
// const validator = require("validator")

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A department must have a name"],
      unique: true,
    },
    manager: {
      type: String,
      required: [true, "A department must have a branch manager"],
    },
    departmentCount :{
      type:Number,
    }
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    }
  }
);
departmentSchema.virtual('positions',{
  ref:'Position',
  localField:'_id',
  foreignField:'department'
})
const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;


