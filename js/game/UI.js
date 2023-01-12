import Player from "./Player.js";
import Obstacles from "./Obstacle.js";
import Scenaries from "./Scenaries.js";
import { writeText } from "../utils/functions.js";
import sounds from "./sounds.js";

export default class UI {
    score = 0;
    lives = ['❤️', '❤️', '❤️'];
    gameState = "menu";

    constructor(ctx) {
        this.ctx = ctx;

        this.x = 0;
        this.y = 0;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;

        this.player = new Player(ctx);
        this.player.createAnimations();

        this.obstacles = new Obstacles(ctx);
        this.scenery = new Scenaries(ctx);

        sounds.backgroundSFX.play();
        sounds.config();

        document.addEventListener("keydown", this.#keydown);
        document.addEventListener("keydown", this.player.keydown);
        document.addEventListener("keyup", this.player.keyup);
    }

    draw() {
        const screens = {
            menu: () => this.#drawMenu(),
            game: () => this.#drawGame(),
            gameOver: () => this.#drawGameOver(),
            win: () => this.#drawWin(),
            scoreboard: () => this.#drawScoreBoard(),
        };

        screens[this.gameState]();
    }

    #checkCollision() {
        for (const obstacle of this.obstacles.obstacles) {
            if (this.player.x < obstacle.x + obstacle.width - 40 &&
                this.player.x + this.player.width - 130 > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.height > obstacle.y
            ) {
                this.#resetStage();
            }
        }
    }

    #checkIfScored() {
        this.obstacles.obstacles.forEach(obstacle => {
            if (obstacle.x < this.player.x && !obstacle.scored) {
                this.score++;
                obstacle.scored = true;
            }

            if (obstacle.x > this.player.x && obstacle.scored)
                obstacle.scored = false;
        });
    }

    #resetStage() {
        sounds.hitSFX.play();
        this.#saveScore();
        this.lives.pop();

        if (this.lives.length > 0) {
            this.player.reset(this.ctx);
            this.gameState = "game";
            this.obstacles.reset();
            this.scenery.reset();
            return;
        }

        this.player.resetDeadAnimation();
        this.gameState = "gameOver";
    }

    #resetAll() {
        this.score = 0;
        this.lives = ['❤️', '❤️', '❤️'];
        this.player.reset(this.ctx);
        this.obstacles.reset();
    }

    #drawMenu() {
        writeText(this.ctx, { font: "34px Arial Black" }, "Press Enter to start", { x: this.width / 2, y: this.height / 2 });
        writeText(this.ctx, { font: "16px Arial" }, "Press C to open the commands", { x: this.width / 2, y: this.height / 2 + 90 });
        writeText(this.ctx, { font: "16px Arial" }, "1- easy difficulty  |  2- medium difficulty  |  3- hard difficulty", { x: this.width / 2, y: this.height / 2 + 120 });
    }

    #drawGame() {
        writeText(this.ctx, { font: "26px Arial", align: "left" }, this.lives.join(""), { x: 10, y: 30 });
        writeText(this.ctx, { font: "26px Arial", align: "left" }, "Score: " + this.score, { x: this.width - 110, y: 30 });

        this.scenery.draw(this.ctx);
        this.scenery.cloudCanMoveLeft = (this.player.rightPressed) ? true : false;
        this.scenery.cloudCanMoveRight = (this.player.leftPressed) ? true : false;
        this.scenery.playerIsRunning = (this.player.runPressed) ? true : false

        this.player.draw(this.ctx);
        this.obstacles.draw(this.ctx);
        this.obstacles.canMoveLeft = (this.player.rightPressed) ? true : false;
        this.obstacles.canMoveRight = (this.player.leftPressed) ? true : false;
        this.obstacles.playerIsRunning = (this.player.runPressed) ? true : false;

        this.#checkIfScored();
        this.#checkCollision();

        // if (this.score === 10) this.gameState = "win";
    }

    #drawGameOver() {
        const isTheBiggestScore = this.#isTheBiggestScore();
        let scoreText = isTheBiggestScore ? `New Record! Congratulations - Score:${this.score} points` : `Score: ${this.score} points`;

        writeText(this.ctx, { color: "#c03939", font: "34px Arial Black" }, "You died!", { x: this.width / 2, y: this.height / 2 - 60 });
        writeText(this.ctx, { font: "18px Arial" }, "Press Enter to restart", { x: this.width / 2, y: this.height / 2 });
        writeText(this.ctx, { font: "16px Arial" }, scoreText, { x: this.width / 2, y: this.height / 2 + 30 });
        writeText(this.ctx, { font: "16px Arial" }, "Press C to open the commands", { x: this.width / 2, y: this.height / 2 + 90 });

        this.player.draw(this.ctx, true);
    }

    #drawWin() {
        writeText(this.ctx, { color: "#c03939", font: "34px Arial Black" }, "You Win! Congratulations!", { x: this.width / 2, y: this.height / 2 });
        writeText(this.ctx, { color: "#c03939", font: "18px Arial Black" }, `Score: ${this.score}  |  Lives: ${this.lives}`, { x: this.width / 2, y: this.height / 2 + 30 });
        writeText(this.ctx, { font: "18px Arial" }, "Press Enter to play again...", { x: this.width / 2, y: this.height / 2 + 60 });
        writeText(this.ctx, { font: "16px Arial" }, "Press C to open the commands", { x: this.width / 2, y: this.height / 2 + 120 });
        this.#saveScore();
    }

    #drawScoreBoard() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];

        writeText(this.ctx, { font: "34px Arial Black" }, "Scoreboard", { x: this.width / 2, y: this.height / 2 - 60 });

        if (scores.length === 0) return writeText(this.ctx, { font: "16px Arial" }, "No scores yet", { x: this.width / 2, y: this.height / 2 });

        scores.sort((a, b) => b.score - a.score).forEach((score, index) => {
            const isFirst = index === 0;
            const isLessThanFive = index < 5;
            const color = isFirst ? "#c03939" : "#fff";
            const font = isFirst ? "16px Arial Black" : "16px Arial";

            isLessThanFive && writeText(this.ctx, { color, font }, `${index + 1}. Score: ${score.score} & Date: ${score.date}`, { x: this.width / 2, y: this.height / 2 + 10 + index * 30 });
        });
    }

    #saveScore() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        const scoreAlreadyExists = scores.find((score) => score.score === this.score);
        if (scoreAlreadyExists) return;

        const currentDate = new Date().toLocaleDateString();

        scores.push({ score: this.score, date: currentDate });
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    #deleteScore() {
        confirm("Are you sure you want to delete the scoreboard?") && localStorage.removeItem("scores");
    }

    #isTheBiggestScore() {
        let isTheBiggestScore = false;

        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        if (scores.length === 0) return isTheBiggestScore = true;

        scores.sort((a, b) => b.score - a.score);
        if (this.score > scores[0].score) isTheBiggestScore = true;
        return isTheBiggestScore;
    }

    #enterPressed() {
        if (this.gameState === "game") return;

        this.#resetAll();
        if (this.gameState === "menu" || this.gameState === "gameOver") return this.gameState = "game";
        if (this.gameState === "win" || this.gameState === "scoreboard" || this.gameState === "scoreboard") return this.gameState = "menu";
    }

    #setDifficulty(difficulty) {
        if (this.gameState === "game") return;

        const firstLetterUppercase = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        alert(`${firstLetterUppercase} difficulty selected.`);
        this.obstacles.setSpeed(difficulty);
    }

    #keydown = (event) => {
        const events = {
            Enter: () => this.#enterPressed(),
            Digit1: () => {
                this.#setDifficulty("easy");
            },
            Digit2: () => {
                this.#setDifficulty("medium");
            },
            Digit3: () => {
                this.#setDifficulty("hard");
            },
            KeyS: () => this.gameState = "scoreboard",
            Delete: () => this.#deleteScore(),
            KeyM: () => sounds.toggleMute(),
        };

        const action = events[event.code];
        action && action();
    }

    #touchstart = () => {
        if (this.gameState === "menu" || this.gameState === "gameOver") {
            this.#resetAll();
            this.gameState = "game";
        }
    }
}
