const express = require("express");
const router = express.Router();
const { join } = require("path");
const { uploadImage } = require("./controller");

// EJS simple pages ---------------------------------------------------------------------------------------------------

router.get("/", (req, res) => {
  return res.render(join(__dirname, "./views/home.ejs"), { title: "Home" });
});

router.get("/file-limit", (req, res) => {
  return res.render(join(__dirname, "./views/fileLimitReached.ejs"), { title: "File Limit Reached" });
});

router.post("/upload-image", uploadImage);

module.exports = router;
