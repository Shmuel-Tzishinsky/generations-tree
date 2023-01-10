const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const port = 3500;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This page is unsupported in browser...");
});

app.post("/saveTheTree", async (req, res) => {
  try {
    fs.writeFileSync("../client/src/json/generations.json", JSON.stringify(req.body, null, 2));
    res.status(200).json({ meg: "Json is create successful" });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
});

app.listen(port, () => console.log(`Listen on port ${port}`));
