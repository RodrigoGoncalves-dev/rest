const { Router } = require("express");
const router = new Router();
const demandController = require("../controllers/DemandController");

router.get("/", demandController.index);
router.post("/", demandController.store);
router.get("/:id", demandController.show);

module.exports = router;