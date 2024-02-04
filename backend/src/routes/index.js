const { Router } = require("express");

const BetController = require('../controllers/BetController');
const FinancialHistoryController = require('../controllers/FinancialHistoryController');
const ParlayController = require('../controllers/ParlayController');
const AuthController = require('../controllers/AuthController');
const BetTypeController = require('../controllers/BetTypeController');

const router = Router();

router.get("/healthy", (req, res) => res.send("Everything is okay"));

router.use('/auth', AuthController)
router.use("/bet", BetController);
router.use("/parlay", ParlayController);
router.use("/bet-type", BetTypeController);
router.use("/financial-history", FinancialHistoryController);

module.exports = router;
