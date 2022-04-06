const Department = require("../models/departmentModel");

exports.getAllDepartments = async (req, res) => {
  const sort = {}
  if(req.query.sortBy && req.query.orderBy){
    sort[req.query.sortBy] = req.query.orderBy==='desc' ? -1 : 1;
  }
  Department.find((err, departments) => {
    if (departments) {
      res.send(departments);
    } else {
      return res.status(201).json({ err });
    }
  }).populate({path:"positions"}).sort(sort);
};

exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    res.status(200).json({ department });
  } catch (err) {
    res.status(404).json({ err });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const newDepartment = await Department.create(req.body);
    res.status(200).json({
      newDepartment,
    });
  } catch (err) {
    res.status(400).json({
      err,
    });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      department,
    });
  } catch (err) {
    res.status(400).json({
      err,
    });
  }
};
exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "deleted",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      err,
    });
  }
};
