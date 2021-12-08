const { Router } = require("express");
const router = new Router();
const ClientController = require("../controllers/ClientController");

router.post("/", ClientController.store);
router.post("/login/", ClientController.login);

module.exports = router;