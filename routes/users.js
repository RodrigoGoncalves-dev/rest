const { Router } = require("express");
const router = new Router();
const UserController = require("../controllers/UserController");

router.post("/", UserController.store);
router.post("/login/", UserController.login);

module.exports = router;