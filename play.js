const WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m"];
const BLACK_KEYS = ["s", "d", "g", "h", "j"];

let isRecording = false;
let recordedMelody = [];
let startTime = 0;

const whiteKeys = document.querySelectorAll('.key.white');
const blackKeys = document.querySelectorAll('.key.black');

const recordButton = document.getElementById("recordButton");
const playButton = document.getElementById("playButton");

recordButton.addEventListener("click", toggleRecording);
playButton.addEventListener("click", playRecordedMelody);

document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", function() {
    const note = this.dataset.note;
    if (isRecording) {
      const time = Date.now();
      recordedMelody.push({ note, time });
    }
    playAudio(note);
  });
});

document.addEventListener("keydown", function(e) {
  const key = e.key.toLowerCase();
  const whiteKeyIndex = WHITE_KEYS.indexOf(key);
  const blackKeyIndex = BLACK_KEYS.indexOf(key);

  if (whiteKeyIndex > -1 || blackKeyIndex > -1) {
    const note = whiteKeyIndex > -1 ? whiteKeys[whiteKeyIndex].dataset.note : blackKeys[blackKeyIndex].dataset.note;
    if (isRecording) {
      const time = Date.now();
      recordedMelody.push({ note, time });
    }
    playAudio(note);
  }
});

function toggleRecording() {
  isRecording = !isRecording;
  if (isRecording) {
    recordedMelody = []; // Limpa a melodia gravada
    startTime = Date.now(); // Obtém o tempo de início da gravação
    recordButton.classList.add("active");
  } else {
    recordButton.classList.remove("active");
  }
}

function playRecordedMelody() {
  recordedMelody.forEach(({ note, time }) => {
    setTimeout(() => playAudio(note), time - startTime); // Reproduz cada nota na hora correta
  });
}

function playAudio(note) {
  const audio = new Audio(`notes/${note}.mp3`);
  audio.play();
}

let isNotesVisible = false;

const notesButton = document.getElementById("notesButton");
const keyboardKeys = document.querySelectorAll(".key");

notesButton.addEventListener("click", toggleShowNotes);

function toggleShowNotes() {
  if (!isNotesVisible) {
    isNotesVisible = true;
    showNotes();
  } else {
    isNotesVisible = false;
    hideNotes()
  }
}

function showNotes() {
  return keyboardKeys.forEach(
    (key) => (key.textContent = key.dataset.note)
  );
}

function hideNotes() {
  return keyboardKeys.forEach(
    (key) => (key.textContent ="")
  );
}
