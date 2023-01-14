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

        this.setSpeed();
    }

    draw() {
        for (const obstacle of this.obstacles) {
            obstacle.draw();

            this.canMoveLeft && obstacle.moveLeft(this.playerIsRunning);
            this.canMoveRight && obstacle.moveRight();

            obstacle.outOfBounds() && obstacle.reset();
        }
    }

    setSpeed(selectedDifficulty = "easy") {
        this.obstacles.forEach(obstacle => obstacle.setSpeed(selectedDifficulty));
    }

    reset() {
        this.obstacles.forEach(obstacle => obstacle.reset());
    }
}

class Obstacle {
    speed = 0;
    width = 70;
    height = 30;

    constructor(context) {
        this.context = context;

        this.x = context.canvas.width;
        this.y = context.canvas.height - 35;
    }

    setSpeed(selectedDifficulty) {
        const difficultySpeeds = {
            easy: 5,
            medium: 10,
            hard: 15
        };

        this.speed = difficultySpeeds[selectedDifficulty];
    }

    draw() {
        this.context.font = "50px Arial";
        this.context.fillText("🌵", this.x, this.y);
    }

    moveLeft(playerIsRunning) {
        this.x -= this.speed + (playerIsRunning ? 5 : 0);
    }

    moveRight() {
        this.x += this.speed;
    }

    reset() {
        let randomNumber = Math.floor(Math.random() * 1000);
        this.x = this.context.canvas.width + randomNumber * 15;
    }

    outOfBounds() {
        return this.x + this.width < 0;
    }
}