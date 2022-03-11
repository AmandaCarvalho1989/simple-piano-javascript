const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Song = require("./models/song.js");
const  ffmpeg = require('ffmpeg')

const multer = require('multer');



mongoose.connect("mongodb://localhost/songRecorder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));


const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log('filename')
    cb(null, file.originalname)
  },
  destination: function (req, file, cb) {
    console.log('storage')
    cb(null, './uploads')
  },
})

const upload = multer({ storage })


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/songs", async (req, res) => {
  const song = new Song({
    notes: req.body.songNotes,
  });

  console.log({ song });
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

  res.render("index", { song });
});

app.post("/save-song",  async (req, res) => {
  console.log('req',req.body)
  const audioData = req.body.recordedAudio
  const blob = req.body.audio
  const blobPath = audioData.src.substr(5)
  console.log('audioData',audioData)
  console.log('blobPath',blobPath)
  console.log('blob',blob)


  try {
    var process = new ffmpeg(blobPath)
    process.then(function (audio){
      audio.fnExtractSoundToMP3('/new-song', function (error, file){
        if(!error){
          console.log('Audio file ', file)
        }
      })
    }, function (err){
      console.log('Error: ', err)
    })
  } catch (error) {
    console.log(error.code)
    console.log(error.msg)
    
  }
});

app.listen(5000);
