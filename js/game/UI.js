import { writeTextOnCanvas, drawBackgroundOnCanvas } from "../utils/functions.js";

import colors from "./colors.js";
import sounds from "./sounds.js";

import { DEFAULT_SCREEN, SCREENS_MESSAGES, GAME_SCREENS } from "./constants.js";

import Player from "./Player.js";
import Scenaries from "./Scenaries.js";
import Obstacles from "./Obstacle.js";

export default class UI {
    currentScreen = DEFAULT_SCREEN;
    numLifes = 4;
    lifes = [];
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

        this.#enableEventListeners();
        this.#setLifes();
    }

    #enableEventListeners() {
        document.addEventListener("keypress", this.#keypress);
        document.addEventListener("keydown", this.player.keydown);
        document.addEventListener("keyup", this.player.keyup);
    }

    draw() {
        const screens = {
            menuScreen: () => this.#drawMenuScreen(),
            gameScreen: () => this.#drawGameScreen(),
            gameOverScreen: () => this.#drawGameOverScreen(),
            winScreen: () => this.#drawWinScreen(),
            scoreboardScreen: () => this.#drawScoreBoardScreen(),
        };

        screens[this.currentScreen]();
    }

    #drawMenuScreen() {
        drawBackgroundOnCanvas(this.context, colors.menuBackground);

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

    #drawGameScreen() {
        let isScoreBiggerThanNine = this.score > 9;
        let isHighestScoreBiggerThanNine = this.#getHighestScore() > 9;
        let scorePaddingRight = isScoreBiggerThanNine ? 10 : 0;
        let highestScorePaddingRight = isHighestScoreBiggerThanNine ? 10 : 0;

        drawBackgroundOnCanvas(this.context, colors.gameBackground, true);

        this.sceneries.draw();
        this.#checkCloudsMovements();

        this.player.draw();

        this.obstacles.draw();
        this.#checkObstacleMovement();

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.lifes(this.lifes),
            { x: 10, y: 30 },
            { font: "18px Arial", align: "left" },
        );

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.highest(this.#getHighestScore()),
            { x: this.width - 143 - highestScorePaddingRight, y: 30 },
            { font: "18px Arial", align: "left" },
        );

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.score(this.score),
            { x: this.width - 80 - scorePaddingRight, y: 60 },
            { font: "18px Arial", align: "left" },
        );

        this.#checkScore();
        this.#checkIfCanUpdateHighestScore();
        this.#checkCollisionWithObstacle();
    }

    #drawGameOverScreen() {
        let scoreIsBiggerThanHighestScore = this.score > this.#getHighestScore();
        let scoreText = scoreIsBiggerThanHighestScore ? SCREENS_MESSAGES.record : SCREENS_MESSAGES.score(this.score);

        drawBackgroundOnCanvas(this.context, colors.gameOverBackground);

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.gameOver.title,
            { x: this.width / 2, y: this.height / 2 - 60 },
            { color: colors.normalFont, font: "34px Arial Black" },
        );
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.gameOver.subtitle,
            { x: this.width / 2, y: this.height / 2 },
            { font: "18px Arial" },
        );
        writeTextOnCanvas(
            this.context,
            scoreText,
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

    #drawWinScreen() {
        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.win.title,
            { x: this.width / 2, y: this.height / 2 },
            { color: colors.successFont, font: "34px Arial Black", border: true },
        );
        writeTextOnCanvas(
            this.context,
            `${SCREENS_MESSAGES.score(this.score)} 🎉`,
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

    #drawScoreBoardScreen() {
        drawBackgroundOnCanvas(this.context, colors.scoreboardBackground);

        const scores = this.#getScores();
        const sortedScoresByTheBiggest = scores.sort((a, b) => b.score - a.score);

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.scoreboard.title,
            { x: this.width / 2, y: 50 },
            { font: "34px Arial Black", color: colors.successFont, border: true },
        );

        if (scores.length === 0)
            return writeTextOnCanvas(
                this.context,
                SCREENS_MESSAGES.scoreboard.noScores,
                { x: this.width / 2, y: this.height / 2 },
                { color: colors.dangerFont }
            );

        sortedScoresByTheBiggest.forEach((score, index) => {
            const isFirst = index === 0,
                isLessThanFive = index < 5,
                color = isFirst ? colors.dangerFont : colors.normalFont,
                font = isFirst ? "17px Arial Black" : "16px Arial";

            isLessThanFive && writeTextOnCanvas(
                this.context,
                SCREENS_MESSAGES.scoreboard.score(index, score),
                { x: this.width / 2, y: this.height / 2 - 60 + index * 30 },
                { color, font },
            );
        });

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.scoreboard.paragraph,
            { x: this.width / 2, y: this.height / 2 + 200 },
        );
    }

    #setGameScreen(keyPressed) {
        if (this.currentScreen === GAME_SCREENS.game) return;
        this.#resetAll();

        switch (keyPressed) {
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

    #checkScore() {
        const allObstacles = this.obstacles.obstacles;

        allObstacles.forEach((obstacle) => {
            const playerPassedObstacle = obstacle.x + obstacle.width < this.player.x && !obstacle.passed;
            if (playerPassedObstacle) this.score++;
        });
    }

    #checkIfCanUpdateHighestScore() {
        const highestScore = this.#getHighestScore();
        if (this.score > highestScore) this.#saveHighestScore();
    }

    #saveHighestScore() {
        localStorage.setItem("highestScore", this.score);
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

        const lifesPerDifficulty = {
            "easy": 4,
            "medium": 3,
            "hard": 2,
        }

        this.numLifes = lifesPerDifficulty[selectedDifficulty];
        this.#setLifes();

        this.obstacles.setVelocity(selectedDifficulty);
        alert(`The ${selectedDifficulty} difficulty is selected.`);
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

    #removeOneLifeFromThePlayer() {
        this.lifes.pop();
    }

    #setLifes() {
        this.lifes = [];
        for (let i = 0; i < this.numLifes; i++) this.lifes.push('❤️');
        this.defaultLifes = this.lifes;
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
        this.lifes = [...this.defaultLifes];
        this.player.reset();
        this.obstacles.reset();
    }

    #getScores = () => JSON.parse(localStorage.getItem("scores")) || [];

    #getHighestScore = () => {
        const highestScore = localStorage.getItem("highestScore");
        return highestScore ? highestScore : 0;
    };

    #saveScore() {
        const scores = this.#getScores();
        const scoreAlreadyExists = scores.find((score) => score.score === this.score);
        if (scoreAlreadyExists) return;

        const currentTime = new Date().toLocaleString();
        scores.push({ score: this.score, date: currentTime });
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    #deleteScores() {
        if (confirm("Are you sure you want to delete the scoreboard?")) {
            localStorage.removeItem("scores");
            localStorage.removeItem("highestScore");
        }
    }

    #keypress = (event) => {
        const events = {
            Enter: () => this.#setGameScreen("enter"),
            KeyS: () => this.#setGameScreen("s"),
            KeyR: () => this.#deleteScores(),
            KeyM: () => sounds.toggleMute(),
            Digit1: () => this.#setDifficulty("easy"),
            Digit2: () => this.#setDifficulty("medium"),
            Digit3: () => this.#setDifficulty("hard"),
        };

        events[event.code] && events[event.code]();
    }
}
