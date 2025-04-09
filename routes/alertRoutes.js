const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");

// GET /alerts - Fetch all triggered alerts
router.get("/", alertController.getAlerts);

module.exports = router;
