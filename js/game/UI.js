import { writeTextOnCanvas } from "../utils/functions.js";

import colors from "./colors.js";
import sounds from "./sounds.js";

import Player from "./Player.js";
import Scenaries from "./Scenaries.js";
import Obstacles from "./Obstacle.js";

const GAME_SCREENS = {
    menu: "menuScreen",
    game: "gameScreen",
    gameOver: "gameOverScreen",
    win: "winScreen",
    scoreboard: "scoreboardScreen",
};

const SCREENS_MESSAGES = {
    menu: {
        title: "Press Enter to start",
        subtitle: "Press C to open the commands",
    },
    gameOver: {
        title: "Game Over!",
        subtitle: "Press Enter to restart",
        paragraph: "Press C to open the commands",
    },
    win: {
        title: "You Win!",
        subtitle: "Press Enter to play again",
        paragraph: "Press C to open the commands",
    },
    scoreboard: {
        title: "Scoreboard",
        paragraph: "Press Enter to go back to menu",
    },
};

const DEFAULT_SCREEN = GAME_SCREENS.menu;

export default class UI {
    currentScreen = DEFAULT_SCREEN;
    lifes = ['❤️', '❤️', '❤️', '❤️'];
    score = 0;

    constructor(context) {
        this.context = context;

        this.x = 0;
        this.y = 0;
        this.width = context.canvas.width;
        this.height = context.canvas.height;

        this.player = new Player(context);
        this.sceneries = new Scenaries(context);
        this.obstacles = new Obstacles(context);

        sounds.config();
        sounds.backgroundSFX.play();

        this.enableEventListeners();
    }

    enableEventListeners() {
        document.addEventListener("keydown", this.#keydown);
        document.addEventListener("keydown", this.player.keydown);
        document.addEventListener("keyup", this.player.keyup);
    }

    draw() {
        const screens = {
            menuScreen: () => this.#drawMenu(),
            gameScreen: () => this.#drawGame(),
            gameOverScreen: () => this.#drawGameOver(),
            winScreen: () => this.#drawWin(),
            scoreboardScreen: () => this.#drawScoreBoard(),
        };

        screens[this.currentScreen]();
    }

    #drawMenu() {
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.menu.title,
            { x: this.width / 2, y: this.height / 2 },
            { font: "34px Arial Black", color: colors.successFont, border: true },
        );
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.menu.subtitle,
            { x: this.width / 2, y: this.height / 2 + 90 }
        );
    }

    #drawGame() {
        let isScoreBiggerThanNine = this.score > 9;
        let paddingRight = isScoreBiggerThanNine ? 10 : 0;

        writeTextOnCanvas(
            this.context,
            this.lifes.join(""),
            { x: 10, y: 35 },
            { font: "26px Arial", align: "left" },
        );
        writeTextOnCanvas(
            this.context,
            `Score: ${this.score}`
            , { x: this.width - 110 - paddingRight, y: 35 },
            { font: "26px Arial", align: "left" },
        );

        this.sceneries.draw();
        this.#checkCloudsMovements();

        this.player.draw();
        this.obstacles.draw();
        this.#checkObstacleMovement();

        this.#checkScore();
        this.#checkCollisionWithObstacle();
    }

    #drawGameOver() {
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.gameOver.title,
            { x: this.width / 2, y: this.height / 2 - 60 },
            { color: colors.dangerFont, font: "34px Arial Black", border: true },
        );
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.gameOver.subtitle,
            { x: this.width / 2, y: this.height / 2 },
            { font: "18px Arial" },
        );
        writeTextOnCanvas(
            this.context,
            `Score: ${this.score} points`,
            { x: this.width / 2, y: this.height / 2 + 30 }
        );
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.gameOver.paragraph,
            { x: this.width / 2, y: this.height / 2 + 90 }
        );

        this.#saveScore();
        this.player.draw(true);
    }

    #drawWin() {
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.win.title,
            { x: this.width / 2, y: this.height / 2 },
            { color: colors.successFont, font: "34px Arial Black", border: true },
        );
        writeTextOnCanvas(
            this.context,
            `Score: ${this.score}  |  Lives: ${this.lifes}`,
            { x: this.width / 2, y: this.height / 2 + 30 },
            { color: colors.dangerFont, font: "18px Arial Black" },
        );
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.win.subtitle,
            { x: this.width / 2, y: this.height / 2 + 60 },
            { font: "18px Arial" },
        );
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.win.paragraph,
            { x: this.width / 2, y: this.height / 2 + 120 }
        );
    }

    #drawScoreBoard() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        const ordenedScoresByBiggestScore = scores.sort((a, b) => b.score - a.score);

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.scoreboard.title,
            { x: this.width / 2, y: this.height / 2 - 60 },
            { font: "34px Arial Black", color: colors.successFont, border: true },
        );

        if (scores.length === 0)
            return writeTextOnCanvas(
                this.context,
                "No scores here... 😢",
                { x: this.width / 2, y: this.height / 2 },
                { color: colors.dangerFont }
            );

        ordenedScoresByBiggestScore.forEach((score, index) => {
            const isFirst = index === 0,
                isLessThanFive = index < 5,
                color = isFirst ? colors.dangerFont : colors.normalFont,
                font = isFirst ? "16px Arial Black" : "16px Arial";

            isLessThanFive && writeTextOnCanvas(
                this.context,
                `${index + 1}. Score: ${score.score} & Date: ${score.date}`,
                { x: this.width / 2, y: this.height / 2 + 10 + index * 30 },
                { color, font },
            );
        });

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.scoreboard.paragraph,
            { x: this.width / 2, y: this.height / 2 + 200 },
        );
    }

    #setGameScreen(key) {
        if (this.currentScreen === GAME_SCREENS.game) return;
        this.#resetAll();

        switch (key) {
            case "enter":
                if (this.currentScreen === GAME_SCREENS.menu || this.currentScreen === GAME_SCREENS.gameOver)
                    this.currentScreen = GAME_SCREENS.game;
                if (this.currentScreen === GAME_SCREENS.win || this.currentScreen === GAME_SCREENS.scoreboard)
                    this.currentScreen = GAME_SCREENS.menu;
                break;
            case "s":
                if (this.currentScreen === GAME_SCREENS.menu || this.currentScreen === GAME_SCREENS.gameOver)
                    this.currentScreen = GAME_SCREENS.scoreboard;
                break;
            default:
                this.currentScreen = GAME_SCREENS.menu;
                break;
        }
    }

    #checkCloudsMovements() {
        this.sceneries.cloudCanMoveLeft = (this.player.rightPressed) ? true : false;
        this.sceneries.cloudCanMoveRight = (this.player.leftPressed) ? true : false;
        this.sceneries.playerIsRunning = (this.player.runPressed) ? true : false;
    }

    #checkObstacleMovement() {
        this.obstacles.canMoveLeft = (this.player.rightPressed) ? true : false;
        this.obstacles.canMoveRight = (this.player.leftPressed) ? true : false;
        this.obstacles.playerIsRunning = (this.player.runPressed) ? true : false;
    }

    #setDifficulty(selectedDifficulty) {
        if (this.currentScreen === GAME_SCREENS.game) return;

        alert(`The ${selectedDifficulty} difficulty is selected.`);
        this.obstacles.setSpeed(selectedDifficulty);
    }

    #checkCollisionWithObstacle() {
        const allObstacles = this.obstacles.obstacles;
        for (const obstacle of allObstacles) {
            if (
                this.player.x < obstacle.x + obstacle.width - 40 &&
                this.player.x + this.player.width - 130 > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.height > obstacle.y
            )
                this.#resetTheStage();
        }
    }

    #checkScore() {
        const allObstacles = this.obstacles.obstacles;
        for (const obstacle of allObstacles) {
            if (obstacle.x + obstacle.width < 10)
                this.score += 1;
        }

        if (this.scores === 15) this.#addOneLifeToThePlayer();
    }

    #removeOneLifeFromThePlayer() {
        this.lifes.pop();
    }

    #addOneLifeToThePlayer() {
        this.lifes.length < 3 && this.lifes.push('❤️');
    }

    #resetTheStage() {
        sounds.hitSFX.play();
        this.#removeOneLifeFromThePlayer();

        if (this.lifes.length > 0) {
            this.currentScreen = GAME_SCREENS.game;
            this.player.reset();
            this.obstacles.reset();
            return;
        }

        this.player.resetDeadAnimation();
        this.currentScreen = GAME_SCREENS.gameOver;
    }

    #resetAll() {
        this.score = 0;
        this.lifes = ['❤️', '❤️', '❤️', '❤️'];
        this.player.reset();
        this.obstacles.reset();
    }

    #saveScore() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        const scoreAlreadyExists = scores.find((score) => score.score === this.score);
        if (scoreAlreadyExists) return;

        const currentTime = new Date();
        scores.push({ score: this.score, date: currentTime });
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    #deleteScores() {
        confirm("Are you sure you want to delete the scoreboard?") && localStorage.removeItem("scores");
    }

    #keydown = (event) => {
        const events = {
            Enter: () => this.#setGameScreen("enter"),
            KeyS: () => this.#setGameScreen("s"),
            Delete: () => this.#deleteScores(),
            KeyM: () => sounds.toggleMute(),
            Digit1: () => this.#setDifficulty("easy"),
            Digit2: () => this.#setDifficulty("medium"),
            Digit3: () => this.#setDifficulty("hard"),
        };

        events[event.code] && events[event.code]();
    }
}
