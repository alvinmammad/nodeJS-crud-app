// const path = require('path');
const express = require("express");

const departmentRouter = require("./routes/departmentRoutes");
const employeeRouter = require("./routes/employeeRoutes");
const positionRouter = require("./routes/positionRoutes");
const cors = require('cors')
const app = express();

//middlewares

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// np
app.use( express.static('public') )
app.use(cors())
app.options('*', cors());
//routes
app.use("/api/v1/positions", positionRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/departments", departmentRouter);

const port = 3000;
app.listen(port, (req, res) => {
  console.log(`Express running -> PORT ${port}`);
});


module.exports = app;
