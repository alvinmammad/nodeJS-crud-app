const express = require("express");
const employeeController = require("../controllers/employeeController");
const router = express.Router();
router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(employeeController.createEmployee);
router
  .route("/:id")
  .get(employeeController.getEmployee)
  .patch(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);
// router.route("/getEmployeesByName").post(employeeController.getEmployeesByName);
module.exports = router;
