import { writeTextOnCanvas, drawBackgroundOnCanvas, drawButtonOnCanvas } from "../utils/functions.js";
import { SCREEN_TITLES, DEFAULT_SCREEN, SCREENS_MESSAGES, GAME_SCREENS } from "../utils/constants.js";

import colors from "../utils/colors.js";
import sounds from "../utils/sounds.js";

import Player from "./Player.js";
import Ground from "./Ground.js";
import Obstacles from "./Obstacle.js";
import Controls from "./ControlsContext.js";

export default class Game {
    constructor(gameContext, mobileContext) {
        this.context = gameContext;
        this.mobileContext = mobileContext;
        this.width = gameContext.canvas.width;
        this.height = gameContext.canvas.height;
        this.currentScreen = DEFAULT_SCREEN;
        this.numLifes = 4;
        this.lifes = [];
        this.score = 0;

        this.player = new Player(gameContext);
        this.ground = new Ground(gameContext);
        this.obstacles = new Obstacles(gameContext);
        this.gameControls = new Controls(mobileContext, this.player);

        sounds.config();
        this.#enableEventListeners();
        this.#setLifes();
    }

    #enableEventListeners() {
        this.gameControls.resize();

        addEventListener("resize", () => this.gameControls.resize());
        document.addEventListener("keypress", this.#keypress);
        document.addEventListener("keydown", this.player.keydown);
        document.addEventListener("keyup", this.player.keyup);
    }

    draw() {
        const screens = {
            menuScreen: () => this.drawMenuScreen(),
            gameScreen: () => this.drawGameScreen(),
            gameOverScreen: () => this.drawGameOverScreen(),
            winScreen: () => this.drawWinScreen(),
            scoreboardScreen: () => this.drawScoreBoardScreen(),
            commandsScreen: () => this.drawCommandsScreen(),
        };

        screens[this.currentScreen]();
    }

    drawMenuScreen() {
        drawBackgroundOnCanvas(this.context, colors.screenBackground);

        writeTextOnCanvas(
            this.context,
            "The Dinosaur Game",
            { x: this.width / 2, y: this.height / 2 },
            { font: "34px Arial Black", border: true }
        );

        drawButtonOnCanvas(
            this.context,
            () => this.changeScreen(GAME_SCREENS.running),
            {
                text: SCREENS_MESSAGES.menu.button,
                color: colors.successFont,
                x: this.width / 2 - 100,
                y: this.height / 2 + 40,
                width: 200,
                height: 40
            }
        );

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.menu.subtitle,
            { x: this.width / 2, y: this.height - 30 }
        );
    }

    drawGameScreen() {
        const isScoreBiggerThanNine = this.score > 9;
        const isHighestScoreBiggerThanNine = this.#getHighestScore() > 9;
        const scorePaddingRight = isScoreBiggerThanNine ? 10 : 0;
        const highestScorePaddingRight = isHighestScoreBiggerThanNine ? 10 : 0;

        drawBackgroundOnCanvas(this.context, colors.gameBackground, true);

        this.obstacles.draw();
        this.#checkObstacleMovement();

        this.player.draw();
        this.ground.draw();

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.lifes(this.lifes),
            { x: 10, y: 30 },
            { font: "18px Arial", align: "left" }
        );

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.highest(this.#getHighestScore()),
            { x: this.width - 143 - highestScorePaddingRight, y: 30 },
            { font: "18px Arial", align: "left" }
        );

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.score(this.score),
            { x: this.width - 80 - scorePaddingRight, y: 60 },
            { font: "18px Arial", align: "left" }
        );

        this.#checkScore();
        this.#checkCollisionWithObstacle();
    }

    drawGameOverScreen() {
        const scoreIsRecord = this.score >= this.#getHighestScore();

        drawBackgroundOnCanvas(this.context, colors.gameOverBackground);

        this.player.draw(true);

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.gameOver.title,
            { x: this.width / 2, y: this.height / 2 - 40 },
            { color: colors.normalFont, font: "34px Arial Black" }
        );

        drawButtonOnCanvas(
            this.context,
            () => this.changeScreen(GAME_SCREENS.running),
            {
                text: SCREENS_MESSAGES.gameOver.button,
                color: colors.normalFont,
                bgColor: colors.dangerFont,
                x: this.width / 2 - 100,
                y: this.height / 2 - 20,
                width: 200,
                height: 40
            }
        );

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.score(this.score),
            { x: this.width / 2, y: this.height / 2 + 50 }
        );

        if (scoreIsRecord) {
            writeTextOnCanvas(
                this.context,
                SCREENS_MESSAGES.record,
                { x: this.width / 2, y: this.height / 2 + 80 }
            );
        }

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.gameOver.paragraph,
            { x: this.width / 2, y: this.height - 30 }
        );
    }

    drawScoreBoardScreen() {
        drawBackgroundOnCanvas(this.context, colors.screenBackground);

        const scores = this.#getScores();
        const sortedScoresByTheBiggest = scores.slice().sort((a, b) => b.score - a.score);

        writeTextOnCanvas(
            this.context,
            SCREENS_MESSAGES.scoreboard.title,
            { x: this.width / 2, y: 50 },
            { font: "34px Arial Black", color: colors.successFont, border: true }
        );

        if (scores.length === 0) {
            writeTextOnCanvas(
                this.context,
                SCREENS_MESSAGES.scoreboard.noScores,
                { x: this.width / 2, y: this.height / 2 },
                { color: colors.dangerFont }
            );
        } else {
            const renderScore = (context, text, x, y, isFirst) => {
                const color = isFirst ? colors.dangerFont : colors.normalFont;
                const font = isFirst ? "17px Arial Black" : "16px Arial";
                writeTextOnCanvas(context, text, { x, y }, { color, font });
            };

            sortedScoresByTheBiggest.slice(0, 5).forEach((score, index) => {
                const x = this.width / 2;
                const y = this.height / 2 - 60 + index * 30;
                const isFirst = index === 0;

                renderScore(this.context, SCREENS_MESSAGES.scoreboard.score(index, score), x, y, isFirst);
            });

            writeTextOnCanvas(
                this.context,
                SCREENS_MESSAGES.scoreboard.paragraph,
                { x: this.width / 2, y: this.height - 30 }
            );
        }
    }

    drawCommandsScreen() {
        drawBackgroundOnCanvas(this.context, colors.screenBackground);

        writeTextOnCanvas(
            this.context,
            "Commands",
            { x: this.width / 2, y: 50 },
            { font: "34px Arial Black", color: colors.successFont, border: true }
        );

        const tableX = 20;
        const tableY = 110;
        const cellWidth = 220;
        const cellHeight = 28;
        const numRows = 11;
        const numCols = 2;

        const tableData = [
            ['Enter', 'Start the game'],
            ['Arrow Up / Space', 'Jump'],
            ['Arrow Left', 'Walk to the left'],
            ['Arrow Right', 'Walk to the right'],
            ['Shift', 'Run'],
            ['1', 'Easy difficulty'],
            ['2', 'Middle difficulty'],
            ['3', 'Hard difficulty'],
            ['S', 'Open Scoreboard'],
            ['C', 'Open/Close commands'],
            ['R', 'Remove the saved scores'],
        ];

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cellX = tableX + col * cellWidth;
                const cellY = tableY + row * cellHeight;
                const cellText = tableData[row][col];

                writeTextOnCanvas(
                    this.context,
                    cellText,
                    { x: cellX + cellWidth / 6, y: cellY + cellHeight / 2 },
                    { font: "12px Arial Black", color: colors.normalFont, align: "left" },
                );
            }
        }
    }

    #checkScore() {
        const allObstacles = this.obstacles.obstacles;

        allObstacles.forEach((obstacle) => {
            const playerPassedObstacle = ((obstacle.x + obstacle.width) < this.player.x) && !obstacle.passed;
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

    #checkObstacleMovement() {
        this.obstacles.canMoveLeft = this.player.rightPressed;
        this.obstacles.canMoveRight = this.player.leftPressed;
        this.obstacles.playerIsRunning = this.player.runPressed;
    }

    #setDifficulty(selectedDifficulty) {
        if (this.currentScreen === GAME_SCREENS.running) return;

        const lifesPerDifficulty = {
            "easy": 4,
            "medium": 3,
            "hard": 2,
        };

        this.numLifes = lifesPerDifficulty[selectedDifficulty];
        this.#setLifes();

        this.obstacles.setVelocity(selectedDifficulty);
        alert(`The ${selectedDifficulty} difficulty is selected.`);
    }

    #checkCollisionWithObstacle() {
        const allObstacles = this.obstacles.obstacles;
        const playerOffsetX = 50;
        const playerOffsetY = 20;

        for (const obstacle of allObstacles) {
            if (
                this.player.x < obstacle.x + obstacle.width - playerOffsetX &&
                this.player.x + this.player.width - playerOffsetX > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height - playerOffsetY &&
                this.player.y + this.player.height - playerOffsetY > obstacle.y
            ) {
                this.#resetTheStage();
            }
        }
    }

    #removeOneLifeFromThePlayer() {
        this.lifes.pop();
    }

    #setLifes() {
        this.lifes = Array(this.numLifes).fill('❤️');
        this.defaultLifes = [...this.lifes];
    }

    #resetTheStage() {
        sounds.hitSFX.play();
        this.#removeOneLifeFromThePlayer();
        this.#checkIfCanUpdateHighestScore();
        this.#saveScore();

        if (this.lifes.length > 0) {
            this.changeScreen(GAME_SCREENS.running);

            this.player.reset();
            this.obstacles.reset();
            return;
        }

        this.player.resetDeadAnimation();
        this.changeScreen(GAME_SCREENS.gameOver);
    }

    #resetAll() {
        this.score = 0;
        this.lifes = [...this.defaultLifes];
        this.player.reset();
        this.obstacles.reset();
    }

    #getScores = () => JSON.parse(localStorage.getItem("scores")) || [];

    #getHighestScore = () => {
        const highestScore = localStorage.getItem("highestScore") || 0;
        return highestScore;
    };

    #saveScore() {
        const scores = this.#getScores();
        const scoreAlreadyExists = scores.find((score) => score.score === this.score);
        if (!scoreAlreadyExists) {
            const currentTime = new Date().toLocaleString();
            scores.push({ score: this.score, date: currentTime });
            localStorage.setItem("scores", JSON.stringify(scores));
        }
    }

    #deleteScores() {
        if (this.currentScreen === GAME_SCREENS.running) return;

        if (confirm("Are you sure you want to delete the scoreboard?")) {
            localStorage.removeItem("scores");
            localStorage.removeItem("highestScore");
        }
    }

    #setGameScreen(keyPressed) {
        if (this.currentScreen === GAME_SCREENS.running) return;

        this.#resetAll();
        switch (keyPressed) {
            case "enter":
                if (this.currentScreen === GAME_SCREENS.gameOver || this.currentScreen === GAME_SCREENS.menu) {
                    this.changeScreen(GAME_SCREENS.running);
                }

                if (this.currentScreen === GAME_SCREENS.scoreboard || this.currentScreen === GAME_SCREENS.commands) {
                    this.changeScreen(GAME_SCREENS.menu);
                }
                break;

            case "s":
                if (this.currentScreen !== GAME_SCREENS.running) {
                    this.toggleScreen(GAME_SCREENS.scoreboard, GAME_SCREENS.menu);
                }
                break;

            case "c":
                if (this.currentScreen !== GAME_SCREENS.running) {
                    this.toggleScreen(GAME_SCREENS.commands, GAME_SCREENS.menu);
                }
                break;

            default:
                this.changeScreen(GAME_SCREENS.menu);
                break;
        }
    }

    changeScreen(newScreen) {
        this.currentScreen = newScreen;
        document.title = `The Dinosaur Game - ${SCREEN_TITLES[newScreen]}`;
    }

    toggleScreen(screen1, screen2) {
        this.currentScreen = (this.currentScreen === screen1) ? screen2 : screen1;
        document.title = `The Dinosaur Game - ${SCREEN_TITLES[this.currentScreen]}`;
    }

    #keypress = (event) => {
        const events = {
            Enter: () => this.#setGameScreen("enter"),
            KeyS: () => this.#setGameScreen("s"),
            KeyC: () => this.#setGameScreen("c"),
            KeyM: () => sounds.toggleMute(),
            KeyR: () => this.#deleteScores(),
            Digit1: () => this.#setDifficulty("easy"),
            Digit2: () => this.#setDifficulty("medium"),
            Digit3: () => this.#setDifficulty("hard"),
        };

        events[event.code]?.();
    }
}
