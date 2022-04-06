const express = require("express");
const positionController = require("../controllers/positionController");
const router = express.Router();
router
  .route("/")
  .get(positionController.getAllPositions)
  .post(positionController.createPosition);
router
  .route("/:id")
  .get(positionController.getPosition)
  .patch(positionController.updatePosition)
  .delete(positionController.deletePosition);
module.exports = router;
