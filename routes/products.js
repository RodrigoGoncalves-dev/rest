const { Router } = require("express");
const router = new Router();
const productController = require("../controllers/ProductController");
const login = require("../middleware/middlewareLogin");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads")
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", productController.index);
router.post("/", login, upload.single("product_image"),productController.store);
router.get("/:id", productController.show);
router.patch("/:id", login, upload.single("product_image"),productController.update);
router.delete("/:id", login, productController.delete);

module.exports = router;