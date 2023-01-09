import Player, { musics } from "./Player.js";
import Obstacle from "./Obstacle.js";

function writeText(ctx, options, text, position) {
    ctx.fillStyle = options.color;
    ctx.font = options.font;
    ctx.textAlign = options.align;
    ctx.fillText(text, position.x, position.y);
}

export default class UI {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = 0;
        this.y = 0;

        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;

        this.score = 0;
        this.lives = 3;

        this.player = new Player(ctx);
        this.obstacle = new Obstacle(ctx);

        this.nightmare = false;

        this.gameState = "menu";

        document.addEventListener("keydown", this.#keydown);
    }

    draw() {
        const states = {
            menu: () => this.#drawMenu(),
            game: () => this.#drawGame(),
            gameOver: () => this.#drawGameOver(),
            win: () => this.#drawWin(),
            scoreboard: () => this.drawScoreboard(),
        };

        states[this.gameState]();
    }

    #checkIfPlayerPassedObstacle() {
        (this.obstacle.outOfBounds()) && this.score++;
    }

    #checkCollision() {
        if (
            this.player.x < this.obstacle.x + this.obstacle.width &&
            this.player.x + this.player.width - 130 > this.obstacle.x &&
            this.player.y < this.obstacle.y + this.obstacle.height &&
            this.player.y + this.player.height > this.obstacle.y
        ) {
            musics.hit.play();
            this.lives--;
            this.obstacle.reset(this.lives);
            this.gameState = this.lives === 0 ? "gameOver" : "game";
        }
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.player.reset(this.ctx);
    }

    #drawMenu() {
        writeText(this.ctx, { color: "#fff", font: "32px Arial Black", align: "center" }, "Press Enter to start", { x: this.width / 2, y: this.height / 2 });
        writeText(this.ctx, { color: "#fff", font: "16px Arial", align: "center" }, "Press C to open the commands", { x: this.width / 2, y: this.height / 2 + 30 });
    }

    #drawGame() {
        writeText(this.ctx, { color: "#fff", font: "26px Arial", align: "left" }, "Score: " + this.score, { x: 10, y: 30 });
        writeText(this.ctx, { color: "#fff", font: "26px Arial", align: "left" }, "Lives: " + this.lives, { x: this.width - 100, y: 30 });

        this.ctx.fillStyle = "#1aa12c";
        this.ctx.fillRect(0, this.ctx.canvas.height - 25.5, this.ctx.canvas.width, 26);

        this.player.draw(this.ctx);
        this.obstacle.draw(this.ctx);

        this.#checkCollision();
        this.#checkIfPlayerPassedObstacle();

        if (this.obstacle.outOfBounds()) this.obstacle.reset();

        if (this.score === 10) this.gameState = "win";
    }

    #drawGameOver() {
        writeText(this.ctx, { color: "#c03939", font: "32px Arial Black", align: "center" }, "Game Over", { x: this.width / 2, y: this.height / 2 - 60 });
        writeText(this.ctx, { color: "#fff", font: "16px Arial", align: "center" }, `Score: ${this.score}  |  Lives: ${this.lives}`, { x: this.width / 2, y: this.height / 2 });
        writeText(this.ctx, { color: "#fff", font: "18px Arial", align: "center" }, "Press Enter to restart", { x: this.width / 2, y: this.height / 2 + 30 });
        writeText(this.ctx, { color: "#fff", font: "16px Arial", align: "center" }, "C - Commands", { x: this.width / 2, y: this.height / 2 + 120 });

        this.player.draw(this.ctx, true);
    }

    #drawWin() {
        writeText(this.ctx, { color: "#c03939", font: "32px Arial Black", align: "center" }, "You Win! Congratulations!", { x: this.width / 2, y: this.height / 2 });
        writeText(this.ctx, { color: "#c03939", font: "18px Arial Black", align: "center" }, `Score: ${this.score}  |  Lives: ${this.lives}`, { x: this.width / 2, y: this.height / 2 + 30 });
        writeText(this.ctx, { color: "#fff", font: "18px Arial", align: "center" }, "Press Enter to play again...", { x: this.width / 2, y: this.height / 2 + 90 });
        writeText(this.ctx, { color: "#fff", font: "16px Arial", align: "center" }, "C - Commands", { x: this.width / 2, y: this.height / 2 + 120 });
    }

    #enterPressed() {
        if (this.gameState !== "game") {
            this.reset();

            if (this.gameState === "menu" || this.gameState === "gameOver") return this.gameState = "game";
            if (this.gameState === "win" || this.gameState === "scoreboard") return this.gameState = "menu";
        }
    }

    #keydown = (event) => {
        const events = {
            Enter: () => this.#enterPressed(),
            Digit1: () => this.obstacle.setSpeed("easy"),
            Digit2: () => this.obstacle.setSpeed("medium"),
            Digit3: () => this.obstacle.setSpeed("hard"),
            KeyS: () => musics.toggleMute(),
        };

        const action = events[event.code];
        action && action();
    }
}
