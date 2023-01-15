export default class Obstacles {
    obstacles = [];
    canMoveLeft = false;
    canMoveRight = false;
    playerIsRunning = false;

    constructor(context) {
        this.context = context;
        this.x = 0;
        this.y = 0;
        this.width = context.canvas.width;
        this.height = context.canvas.height;

        this.obstacles.push(
            new Obstacle(context),
            new Obstacle(context),
            new Obstacle(context),
            new Obstacle(context),
            new Obstacle(context),
            new Obstacle(context),
        );

        this.setVelocity();
    }

    draw() {
        for (const obstacle of this.obstacles) {
            obstacle.draw();

            this.canMoveLeft && obstacle.moveLeft(this.playerIsRunning);
            this.canMoveRight && obstacle.moveRight();

            obstacle.outOfBounds() && obstacle.reset();
        }
    }

    setVelocity(selectedDifficulty = "easy") {
        for (const obstacle of this.obstacles) obstacle.setVelocity(selectedDifficulty);
    }

    reset() {
        for (const obstacle of this.obstacles) obstacle.reset();
    }
}

class Obstacle {
    velocity = 0;
    width = 70;
    height = 30;

    constructor(context) {
        this.context = context;

        this.x = context.canvas.width;
        this.y = context.canvas.height - 35;
    }

    setVelocity(selectedDifficulty) {
        const VELOCITIES = {
            easy: 5,
            medium: 10,
            hard: 15
        };

        this.velocity = VELOCITIES[selectedDifficulty];
    }

    draw() {
        this.context.font = "50px Arial";
        this.context.fillText("🌵", this.x, this.y);
    }

    moveLeft(playerIsRunning) {
        this.x -= this.velocity + (playerIsRunning ? 5 : 0);
    }

    moveRight() {
        this.x += this.velocity;
    }

    reset() {
        let randomNumber = Math.floor(Math.random() * 1000);
        this.x = this.context.canvas.width + randomNumber * 15;
    }

    outOfBounds() {
        return this.x + this.width < 0;
    }
}