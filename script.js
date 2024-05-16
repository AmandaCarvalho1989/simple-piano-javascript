const WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m"];
const BLACK_KEYS = ["s", "d", "g", "h", "j"];

const whiteKeys = document.querySelectorAll('.key.white');
const blackKeys = document.querySelectorAll('.key.black');

document.addEventListener('keydown', (e)=>{
  if(e.repeat) return
  const key = e.key
  const whiteKeyIndex = WHITE_KEYS.indexOf(key)
  const blackKeyIndex = BLACK_KEYS.indexOf(key)

  if(whiteKeyIndex > -1) playAudio(whiteKeys[whiteKeyIndex].dataset.note);
  if(blackKeyIndex > -1) playAudio(blackKeys[blackKeyIndex].dataset.note);
});

function playAudio(note) {
  const audio = new Audio(`notes/${note}.mp3`);
  audio.play();
}
