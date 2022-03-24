const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "src", "images"),
  filename: (req, file, cb) => {
    const name =
      fs
        .readdirSync(path.join(__dirname, "src", "images"))
        .filter((file) => file.endsWith("jpg")).length + 1;
    const finalName = `${name}.jpg`;
    cb(null, finalName);
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "src", "images")));
app.use("/css", express.static(path.join(__dirname, "src", "css")));

app.set("views", path.join(__dirname, "src", "views"));
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const images = fs
    .readdirSync(path.join(__dirname, "src", "images"))
    .filter((file) => file.endsWith("jpg"))
    .sort(() => 0.5 - Math.random());
  console.log(images);
  res.render("index.ejs", { images });
});
app.get("/upload", (req, res) => {
  res.render("upload.ejs");
});

app.post("/upload", multer({ storage }).single("image"), (req, res) => {
  return res.send("");
});

app.listen(80);
