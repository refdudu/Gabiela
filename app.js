const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "src", "images"),
  filename: (req, file, cb) => {
    const name = fs
      .readdirSync(path.join(__dirname, "src", "images"))
      .filter((file) => file.endsWith("jpg")).length;
    const finalName = `${name}.jpg`;
    cb(null, finalName);
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "src", "images")));
app.use("/css", express.static(path.join(__dirname, "src", "css")));
app.use("/scripts", express.static(path.join(__dirname, "src", "scripts")));

app.set("views", path.join(__dirname, "src", "views"));
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const images = fs
    .readdirSync(path.join(__dirname, "src", "images"))
    .filter((file) => file.endsWith("jpg"))
    .sort(() => 0.5 - Math.random());
  res.render("index.ejs", { images });
});
app.get("/upload", (req, res) => {
  res.render("upload.ejs");
});

app.post("/upload", multer({ storage }).array("image"), (req, res) => {
  const files = req.files;
  const response = files
    ? res.status(201).json({ files })
    : res.status(400).json({
        error: "error",
      });

  return response;
});
app.delete("/upload/:id", (req, res) => {
  const { id } = req.params;
  const defaultPath = path.join(__dirname, "src", "images");
  fs.unlinkSync(path.join(defaultPath, `${id}.jpg`));
  const images = fs
    .readdirSync(defaultPath)
    .filter((image) => image.endsWith(".jpg"));
  for (const image in images) {
    fs.renameSync(
      path.join(defaultPath, images[image]),
      path.join(defaultPath, `${image}.jpg`)
    );
  }
  return res.send(images);
});

app.listen(80);
