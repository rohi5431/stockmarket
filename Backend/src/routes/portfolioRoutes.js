const express = require("express");
const { getHoldings, getQuote, getTrades } = require("../models/Portfolio");

const router = express.Router();

router.get("/portfolio", getHoldings);
router.get("/quote/:symbol", getQuote);
router.get("/trades", getTrades);

module.exports = router;
