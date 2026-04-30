const express = require("express");
const { getMLInsights } = require("../controllers/aiController");

const router = express.Router();

router.post("/insights/:symbol", getMLInsights);

module.exports = router;
