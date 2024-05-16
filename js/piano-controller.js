recordButton.addEventListener("click", toggleRecording);
playButton.addEventListener("click", playRecordedMelody);

// Adds a listener on click each piano key button
keyboardKeys.forEach(key => {
  key.addEventListener("click", function () {
    const note = this.dataset.note;
    if (isRecording) {
      const time = Date.now();
      recordedMelody.push({ note, time });
    }
    playAudio(note);
  });
});

// Adds a listener on press any key mapped inside WHITE and BLACK keys (script.js)
document.addEventListener("keydown", function (e) {
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

// Adds a listener on notes button
notesButton.addEventListener("click", toggleShowNotes);

// Toggle recording funcionality
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

// Play a full recorded audio (melody)
function playRecordedMelody() {
  recordedMelody.forEach(({ note, time }) => {
    setTimeout(() => playAudio(note), time - startTime); // Reproduz cada nota na hora correta
  });
}

// Play a key audio
function playAudio(note) {
  const audio = new Audio(`assets/${note}.mp3`);
  audio.play();
}

// Switch show notes
function toggleShowNotes() {
  if (!isNotesVisible) {
    isNotesVisible = true;
    keyboardKeys.forEach(key => (key.textContent = key.dataset.note)
    );
  } else {
    isNotesVisible = false;
    keyboardKeys.forEach(key => (key.textContent = "")
    );
  }
}