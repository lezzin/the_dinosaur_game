import UI from "./UI.js";
import myModal from './modal.js';

const canvas = document.createElement("canvas");
document.body.append(canvas);
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;
ctx.imageSmoothingQuality = "high";

const frames = 60;

canvas.width = innerWidth / 1.5;
canvas.height = innerHeight / 1.5;

const ui = new UI(ctx);

function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ui.draw();
}

addEventListener("load", () => {
  setInterval(game, 1000 / frames);

  addEventListener("keypress", e => (e.key === "c" && ui.gameState !== "game") && myModal.toggle());
  addEventListener("click", (e => (e.target.classList.contains("active")) && myModal.close()));
});
