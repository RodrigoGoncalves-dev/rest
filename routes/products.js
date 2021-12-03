const { Router } = require("express");
const router = new Router();
const productController = require("../controllers/ProductController");

router.get("/", productController.index);
router.post("/", productController.store);
router.get("/:id", productController.show);

module.exports = router;