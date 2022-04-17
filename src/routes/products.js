const { Router } = require("express");
const router = new Router();
const productController = require("../../controllers/ProductController");
const user = require("../middleware/middlewareUser");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads")
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  }
  cb(null, false);
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", productController.index);
router.post("/", user, upload.single("product_image"), productController.store);
router.get("/:id", productController.show);
router.patch("/:id", user, upload.single("product_image"), productController.update);
router.delete("/:id", user, productController.delete);

module.exports = router;