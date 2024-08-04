const express = require("express");
const fileUpload = require("express-fileupload");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require("./routes");
const { join } = require("path");
const favicon = require("express-favicon");

// Set up view engine and layout
app.use(expressLayouts);
app.set("layout", join(__dirname, "./views/index.ejs"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    limitHandler: (req, res, next) => {
      return res.redirect("/file-limit");
    }
  })
);

app.use(require("morgan")("dev"));
app.use(favicon(join(__dirname, "../assets/logo.png")));
app.use("/assets", express.static(join(__dirname, "../assets")));
app.use("/styles", express.static(join(__dirname, "./styles")));
app.use(routes);

// not found error
app.use("*", (req, res) => {
  res.status(404);
  return res.render(join(__dirname, "./views/notFound.ejs"), { title: "Home" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
