import UI from "./game/UI.js";
import myModal from './utils/modal.js';
import myLoader from './utils/loader.js';

const dimensions = {
  width: innerWidth / 1.5,
  height: innerHeight / 1.3,
}

const canvas = document.createElement("canvas");
document.body.append(canvas);

canvas.width = dimensions.width;
canvas.height = dimensions.height;

const ctx = canvas.getContext("2d");

const frames = 60;
const ui = new UI(ctx);

function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ui.draw();
}

addEventListener("load", () => {
  myModal.open();
  setTimeout(() => { myLoader.close(); }, 500);
  setInterval(game, 1000 / frames);

  document.addEventListener("keypress", e => {
    const keyPressedIsCAndGameIsNotRunning = e.key === "c" && ui.gameState !== "game";
    keyPressedIsCAndGameIsNotRunning && myModal.toggle();
  });

  document.addEventListener("click", e => {
    const modalIsActive = e.target.classList.contains("active");
    modalIsActive && myModal.close();
  });

  document.addEventListener("visibilitychange", () => {
    document.title = (document.hidden) ? "Come back, please!" : "The Dinosaur Game";
  });
});