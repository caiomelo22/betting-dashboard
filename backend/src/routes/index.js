const { Router } = require("express");

const LeagueController = require('../controllers/LeagueController');
const BetController = require('../controllers/BetController');
const MatchController = require('../controllers/MatchController');
const FinancialHistoryController = require('../controllers/FinancialHistoryController');
const ParlayController = require('../controllers/ParlayController');
const AuthController = require('../controllers/AuthController');
const BetTypeController = require('../controllers/BetTypeController');
const SportController = require('../controllers/SportController');
const { authenticate } = require('../middleware/Auth')

const router = Router();

router.get("/healthy", (req, res) => res.send("Everything is okay"));

router.use('/auth', AuthController)

router.use(authenticate)

router.use("/league", LeagueController);
router.use("/bet", BetController);
router.use("/parlay", ParlayController);
router.use("/match", MatchController);
router.use("/bet-type", BetTypeController);
router.use("/financial-history", FinancialHistoryController);
router.use("/sport", SportController);

module.exports = router;
