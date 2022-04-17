const { Router } = require("express");
const router = new Router();
const demandController = require("../controllers/DemandController");
const client = require("../middleware/middlewareClient");

router.get("/", client, demandController.index);
router.post("/", client, demandController.store);
router.get("/:id", client, demandController.show);
router.patch("/:id", client, demandController.update);
router.delete("/:id", client,demandController.delete);

module.exports = router;