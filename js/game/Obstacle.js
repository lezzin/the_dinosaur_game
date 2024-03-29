import { writeTextOnCanvas } from "../utils/functions.js";
import { OBSTACLES_VELOCITIES, OBSTACLE_IMAGE } from "../utils/constants.js";

export default class Obstacles {
    canMoveLeft = false;
    canMoveRight = false;
    playerIsRunning = false;

    constructor(context) {
        this.context = context;
        this.obstacles = Array.from({ length: 5 }, () => new Obstacle(context));
        this.setVelocity();
    }

    draw() {
        for (const obstacle of this.obstacles) {
            obstacle.draw();

            if (this.canMoveLeft) obstacle.moveLeft(this.playerIsRunning);
            if (this.canMoveRight) obstacle.moveRight();

            if (obstacle.outOfBounds()) {
                obstacle.reset();
            }
        }
    }

    setVelocity(selectedDifficulty = "easy") {
        for (const obstacle of this.obstacles) {
            obstacle.setVelocity(selectedDifficulty);
        }
    }

    reset() {
        for (const obstacle of this.obstacles) {
            obstacle.reset();
        }
    }
}

class Obstacle {
    velocity = 0;
    width = 60;
    height = 20;
    passed = false;

    constructor(context) {
        this.context = context;
        this.x = this.context.canvas.width;
        this.y = this.context.canvas.height / 2 + 166;
    }

    setVelocity(selectedDifficulty) {
        this.velocity = OBSTACLES_VELOCITIES[selectedDifficulty] * (Math.random() * 1.5);
    }

    draw() {
        writeTextOnCanvas(
            this.context,
            OBSTACLE_IMAGE,
            { x: this.x, y: this.y },
            { font: "50px Arial" }
        );
    }

    moveLeft(playerIsRunning) {
        this.x -= this.velocity + (playerIsRunning ? 5 : 0);
    }

    moveRight() {
        this.x += this.velocity;
    }

    reset() {
        this.passed = false;

        let randomNumber = this.context.canvas.width * 2 + Math.floor(Math.random() * 6000);
        this.x = randomNumber;
    }

    outOfBounds() {
        const outOfScreen = this.x + this.width <= 5;
        this.passed = outOfScreen;

        return outOfScreen;
    }
}
