recordButton.addEventListener("click", toggleRecording);
playButton.addEventListener("click", playRecordedMelody);
saveButton.addEventListener("click", saveRecording);

// Adds a listener on click each piano key button
keyboardKeys.forEach((key) => {
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
    const note =
      whiteKeyIndex > -1
        ? whiteKeys[whiteKeyIndex].dataset.note
        : blackKeys[blackKeyIndex].dataset.note;
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
    keyboardKeys.forEach((key) => (key.textContent = key.dataset.note));
  } else {
    isNotesVisible = false;
    keyboardKeys.forEach((key) => (key.textContent = ""));
  }
}

function saveRecording() {
  const recordingName = prompt("Nome da gravação:"); // Solicita um nome para a gravação
  if (recordingName) {
    console.log({ recordedMelody });
    const recording = {
      name: recordingName,
      melody: recordedMelody,
    };
    recordings.push(recording);
    localStorage.setItem("pianoRecordings", JSON.stringify(recordings)); // Salva no localStorage
    loadRecordings();
  }
}

function loadRecordings() {
  const savedRecordings =
    JSON.parse(localStorage.getItem("pianoRecordings")) || [];

    const recordingsContainer = document.getElementById("recordings-container");
  recordingsContainer.innerHTML = "";

  savedRecordings.forEach((recording, index) => {
    const recordingElement = document.createElement("div");
    recordingElement.className ='record-song'
    recordingElement.textContent = `${index + 1}. ${recording.name}`;

    const actionsElement = document.createElement("div");
    actionsElement.className = 'record-song-actions'

    const playButton = document.createElement("button");
    playButton.innerHTML = '<img src="./assets/svgs/play.svg" alt="Play" />';
    playButton.addEventListener("click", () => {
      recordedMelody = recording.melody; // Carrega a gravação selecionada
      playRecordedMelody(); // Reproduz a gravação
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<img src="./assets/svgs/trash.svg" alt="Delete" />';
    deleteButton.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this recording?"
      );

      if (confirmed) {
        savedRecordings.splice(index, 1);
        recordings.splice(index,1)
        localStorage.setItem(
          "pianoRecordings",
          JSON.stringify(savedRecordings)
        );
        alert(`Gravação "${recording.name}" deletada com sucesso!`);
        loadRecordings();
      }
    });

    actionsElement.appendChild(playButton);
    actionsElement.appendChild(deleteButton);
    recordingElement.appendChild(actionsElement)
    recordingsContainer.appendChild(recordingElement);
  });

  if (savedRecordings.length === 0) {
    recordingsContainer.textContent = "Nenhuma gravação salva!";
  }

  console.log("after: ", { savedRecordings });
}

document.addEventListener("DOMContentLoaded", function (event) {
  loadRecordings();
});
