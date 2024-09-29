const WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m"];
const BLACK_KEYS = ["s", "d", "g", "h", "j"];

let isRecording = false;
let isNotesVisible = false;
let recordedMelody = [];
let startTime = 0;
let recordings = [];

const keyboardKeys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll('.key.white');
const blackKeys = document.querySelectorAll('.key.black');

const recordButton = document.getElementById("recordButton");
const playButton = document.getElementById("playButton");
const notesButton = document.getElementById("notesButton");
const saveButton = document.getElementById("saveButton");

const preloadAudio = (src) => {
  const audio = new Audio();
  audio.src = src;
  audio.preload = "auto";
};

const audioFiles = Array.from(keyboardKeys).map(key => `assets/${key.dataset.note}.mp3`);

document.addEventListener("DOMContentLoaded", function(event) { 
  audioFiles.forEach(preloadAudio);
});

