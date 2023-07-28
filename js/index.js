import UI from "./game/UI.js";
import myModal from './utils/modal.js';
import myLoader from './utils/loader.js';
import { GAME_SCREENS } from "./game/constants.js";
import sounds from "./game/sounds.js";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 480;

const frames = 110;
const ui = new UI(context);

function game() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  ui.draw();
}

addEventListener("load", () => {
  sounds.backgroundSFX.play();

  myModal.open();

  setTimeout(() => { myLoader.close(); }, 500);

  setInterval(game, 1000 / frames);

  document.addEventListener("keypress", e => {
    const keyPressedIsCAndGameIsNotRunning = e.key === "c" && ui.currentScreen !== GAME_SCREENS.game;
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