const express = require("express");
// const uploadDocument = require("../controllers/document.controller.js");
const protect = require("../middleware/auth.middleware.js")
const upload = require("../middleware/upload.middleware.js")
const {
  uploadDocument,
  testSemanticSearch,
} = require("../controllers/document.controller.js");

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadDocument
);

//test
router.post(
  "/search",
  protect,
  testSemanticSearch
);





module.exports = router;