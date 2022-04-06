const Employee = require("../models/employeeModel");

exports.getAllEmployees = async (req, res) => {
  const sort = {};
  if (req.query.sortBy && req.query.orderBy) {
    sort[req.query.sortBy] = req.query.orderBy === "desc" ? -1 : 1;
  }
  // if(req.query.name){
  //   const searchedField = req.query.name;
  //   Employee.find({name:{$regex:searchedField.toLowerCase(),$options:'$i'}})
  //   .then(employees=>{
  //     res.send(employees)
  //   })
  // }
  Employee.find((err, employees) => {
    if (employees) {
      res.send(employees);
    } else {
      return res.status(201).json({ err });
    }
  })
    .populate({ path: "position" })
    .sort(sort);


};

// exports.getEmployeesByName = async(req,res)=>{
//   let searchedName = req.body.searchedName;
//   let search = await Employee.find({name:{$regex:new RegExp('^'+searchedName+'.*','i')}}).exec()
//   res.send({searchedName:search})
// }

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "position"
    );
    res.status(200).json({
      employee,
    });
  } catch (err) {
    res.status(404).json({
      err,
    });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = await Employee.create(req.body);
    const result = await Employee.populate(newEmployee, { path: "position" });
    res.status(201).json({
      status: "success",
      data: {
        employee: result,
      },
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const result = await Employee.populate(employee, { path: "position" });
    res.status(200).json({
      result,
    });
  } catch (err) {
    res.status(404).json({
      err,
    });
  }
};
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "deleted",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
