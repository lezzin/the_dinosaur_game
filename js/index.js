import Game from "./game/Game.js";
import sounds from "./game/sounds.js";

addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");

  canvas.width = 480;
  canvas.height = 480;

  const frames = 60;
  const game = new Game(context);

  function runGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.draw();
  }

  document.addEventListener("click", () => {
    sounds.backgroundSFX.play();
  });

  setInterval(runGame, 1000 / frames);

  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "Come back, please!" : "The Dinosaur Game";
  });
});
