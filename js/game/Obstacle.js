export default class Obstacles {
    obstacles = [];
    canMoveLeft = false;
    canMoveRight = false;
    playerIsRunning = false;

    constructor(ctx) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;

        this.obstacles.push(
            new Obstacle(this.ctx),
            new Obstacle(this.ctx),
            new Obstacle(this.ctx),
            new Obstacle(this.ctx),
            new Obstacle(this.ctx),
            new Obstacle(this.ctx),
        );
    }

    setSpeed(selectedDifficulty) {
        this.obstacles.forEach(obstacle => obstacle.setSpeed(selectedDifficulty));
    }

    reset() {
        this.obstacles.forEach(obstacle => obstacle.reset());
    }

    draw() {
        for (const obstacle of this.obstacles) {
            obstacle.draw();

            this.canMoveLeft && obstacle.moveLeft();
            this.canMoveRight && obstacle.moveRight(this.playerIsRunning);

            if (obstacle.outOfBounds()) obstacle.reset();
        }
    }
}

class Obstacle {
    defaultSpeeds = [6, 8, 10];
    speeds = this.defaultSpeeds;
    scored = false;

    constructor(ctx) {
        this.ctx = ctx;

        this.x = ctx.canvas.width;
        this.y = ctx.canvas.height - 57;
        this.width = 50;
        this.height = 30;
    }

    setSpeed(selectedDifficulty) {
        const difficultySpeeds = {
            easy: this.defaultSpeeds,
            medium: this.defaultSpeeds.map(speed => speed + 2),
            hard: this.defaultSpeeds.map(speed => speed + 4),
        };

        this.speeds = difficultySpeeds[selectedDifficulty] ?? this.defaultSpeeds;
    }

    draw() {
        this.ctx.fillStyle = "#ccc";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        const randomNumber = Math.floor(Math.random() * this.speeds.length);
        this.x -= this.speeds[randomNumber];
    }

    moveRight(playerIsRunning) {
        const randomNumber = Math.floor(Math.random() * this.speeds.length);

        if (playerIsRunning) return this.x += this.speeds[randomNumber] * 2;
        this.x += this.speeds[randomNumber];
    }

    reset() {
        let randomIndex = Math.floor(Math.random() * 10);
        this.x = this.ctx.canvas.width + randomIndex * 1000;
    }

    outOfBounds() { return this.x + this.width < 0; }
}