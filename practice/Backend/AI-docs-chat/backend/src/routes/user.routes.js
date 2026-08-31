const express = require("express");
const protect  = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route",
    userId: req.user.userId,
  });
});

module.exports = router;