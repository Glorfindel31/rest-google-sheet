const express = require("express");

const emojis = require("./emojis");
const googleSheet = require("./googleSheet");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/googleSheet", googleSheet);

module.exports = router;
