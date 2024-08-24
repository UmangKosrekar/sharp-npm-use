const { join } = require("path");
require("dotenv").config({ path: join(__dirname, "../.env") });
const express = require("express");
const fileUpload = require("express-fileupload");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = process.env.PORT_LOCAL || 3000;
const routes = require("./routes");
const favicon = require("express-favicon");
const functions = require("firebase-functions");

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

// middleware to counter firebase functions auto suffixing
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    req.path = req.path.slice(4); // Remove the first 4 characters ("/api")
  }
  next(); // Continue to the next middleware or route handler
});

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

exports.api = functions.https.onRequest(app);
