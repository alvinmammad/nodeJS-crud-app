const mongoose = require("mongoose");
const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A position must have a name"],
    },
    department: {
      type: mongoose.Schema.ObjectId,
      ref: "Department",
      required: [true, "Position must belong to a department"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

positionSchema.pre('/^find/',function(next){
  this.populate({
    path:'department',
    select:'name'
  })
  .next()
})
positionSchema.pre('save',function(){
  this.populate({
    path: "department",
    select: "name",
  })
})
const Position = mongoose.model("Position", positionSchema);
module.exports = Position;
