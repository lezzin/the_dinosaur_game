import Player from "./Player.js";

export default class Obstacle {
    constructor(ctx) {
        this.ctx = ctx;
        this.x = ctx.canvas.width;
        this.y = ctx.canvas.height - 55;
        this.width = 50;
        this.height = 30;
        this.speed = 6;
        this.player = new Player(ctx);
    }

    setSpeed(difficulty) {
        const speed = {
            easy: 6,
            medium: 8,
            hard: 10,
        };

        this.speed = speed[difficulty];

        console.log(this.speed);
    }

    draw() {
        this.ctx.fillStyle = "#ccc";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.x -= this.speed;
    }

    reset() {
        this.x = this.ctx.canvas.width;
    }

    outOfBounds() {
        return this.x + this.width < 0;
    }
}