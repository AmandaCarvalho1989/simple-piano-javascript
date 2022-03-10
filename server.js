const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const Song = require("./models/song.js");

mongoose.connect('mongodb://localhost/songRecorder', {
  useNewUrlParser: true, useUnifiedTopology: true
})

const app= express()

app.set("view engine", "ejs");
app.use(express.json());
app.use(cors())
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/songs", async (req, res) => {
  const song = new Song({
    notes: req.body.songNotes,
  });

  console.log({song})
  await song.save();

  res.json(song);
});

app.get("/songs/:id", async (req, res) => {
  let song;

  try {
    song = Song.findById(req.params.id);
  } catch (error) {
    song = undefined;
  }

  res.render('index', { song })
});
app.listen(5000);
