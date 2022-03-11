const WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m"];
const BLACK_KEYS = ["s", "d", "g", "h", "j"];

const recordButton = document.querySelector(".record-button");
const playButton = document.querySelector(".play-button");
const saveButton = document.querySelector(".save-button");
const songLink = document.querySelector(".song-link");

const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");

let recordedAudio = {};
let rec;

const keyMap = [...keys].reduce((map, key) => {
  map[key.dataset.note] = key;
  return map;
}, {});

let recordingStartTime;
let songNotes = [];
let audioChunks = [];

keys.forEach((key) => {
  key.addEventListener("click", () => playNote(key));
});

recordButton.addEventListener("click", toggleRecording);
saveButton.addEventListener("click", sendData);
playButton.addEventListener("click", playSong);

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  rec = new MediaRecorder(stream);
  rec = new MediaRecorder(stream);
  handlerFunction(stream);
});

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const key = e.key;
  const whiteKeyIndex = WHITE_KEYS.indexOf(key);
  const blackKeyIndex = BLACK_KEYS.indexOf(key);

  if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex]);
  if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex]);
});

function toggleRecording() {
  recordButton.classList.toggle("active");
  if (isRecording()) {
    startRecording();
  } else {
    stopRecording();
  }
}

function isRecording() {
  return recordButton !== null && recordButton.classList.contains("active");
}

function startRecording() {
  recordingStartTime = Date.now();
  songNotes = [];
  playButton.classList.remove("show");
  saveButton.classList.remove("show");
  audioChunks = [];
  rec.start();
}

function stopRecording() {
  playSong();
  rec.stop();
  playButton.classList.add("show");
  saveButton.classList.add("show");
}

function playSong() {
  if (songNotes.length === 0) return;

  songNotes.forEach((note) => {
    setTimeout(() => {
      playNote(keyMap[note.key]);
    }, note.startTime);
  });
  console.log(songNotes);
}

function playNote(key) {
  if (isRecording()) recordNote(key.dataset.note);
  const noteAudio = document.getElementById(key.dataset.note);
  noteAudio.currentTime = 0;
  noteAudio.play();
  key.classList.add("active");

  noteAudio.addEventListener("ended", () => {
    key.classList.remove("active");
  });
}

function recordNote(note) {
  songNotes.push({
    key: note,
    startTime: Date.now() - recordingStartTime,
  });
}

function saveSong() {
  axios.post("/songs", { songNotes }).then((res) => {
    console.log({ res });
    songLink.classList.add("show");
    songLink.href = `/songs/${res.data._id}`;
  });
}

function handlerFunction(stream) {
  rec.ondataavailable = (e) => {
    audioChunks.push(e.data);
    if (rec.state == "inactive") {
      let blob = new Blob(audioChunks, { type: "audio/mpeg-3" });
      recordedAudio.src = URL.createObjectURL(blob);
      recordedAudio.controls = true;
      recordedAudio.autoplay = true;
      sendData(blob, recordedAudio);
    }
  };
}
function sendData(data, recordedAudio) {
  console.log({ data, recordedAudio });
  const formData = new FormData()
  formData.append('audio', data)
  axios.post("/save-song", { audio: formData, recordedAudio });
}
