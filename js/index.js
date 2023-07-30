import Game from "./game/Game.js";
import sounds from "./game/sounds.js";

addEventListener("load", () => {
  const gameCanvas = document.querySelector("#canvas_game");
  const gameCanvasContext = gameCanvas.getContext("2d");

  const mobileControlsCanvas = document.querySelector("#canvas_mobile");
  const mobileControlsCanvasContext = mobileControlsCanvas.getContext("2d");

  const frames = 60;
  const game = new Game(gameCanvasContext, mobileControlsCanvasContext);

  function runGame() {
    gameCanvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
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
