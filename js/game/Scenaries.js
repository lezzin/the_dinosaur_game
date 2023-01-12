import { img } from "../utils/functions.js";

export default class Scenaries {
    cloudCanMoveRight = false;
    cloudCanMoveLeft = false;
    playerIsRunning = false;
    clouds = [];

    constructor(ctx) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;

        this.clouds.push(
            new Cloud(this.ctx, img("cloud1.png", "scenaries")),
            new Cloud(this.ctx, img("cloud2.png", "scenaries")),
            new Cloud(this.ctx, img("cloud3.png", "scenaries")),
            new Cloud(this.ctx, img("cloud1.png", "scenaries")),
            new Cloud(this.ctx, img("cloud2.png", "scenaries")),
            new Cloud(this.ctx, img("cloud2.png", "scenaries")),
        );
    }

    draw() {
        // ground
        this.ctx.fillStyle = "#1aa12c";
        this.ctx.fillRect(0, this.ctx.canvas.height - 25.5, this.ctx.canvas.width, 26);
        // line on the ground
        this.ctx.strokeStyle = "#166b21";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.ctx.canvas.height - 25.5);
        this.ctx.lineTo(this.ctx.canvas.width, this.ctx.canvas.height - 25.5);
        this.ctx.stroke();

        // clouds
        for (const cloud of this.clouds) {
            cloud.draw();

            if (this.cloudCanMoveRight) cloud.moveRight(this.playerIsRunning);
            if (this.cloudCanMoveLeft) cloud.moveLeft();

            (cloud.x + cloud.width < 0) && cloud.reset();
        }
    }

    reset() {
        this.clouds.forEach(cloud => cloud.reset());
    }
}

class Cloud {
    constructor(ctx, image) {
        this.ctx = ctx;
        this.x = Math.floor(Math.random() * 1000) + ctx.canvas.width;
        this.y = Math.floor(Math.random() * 100) + 50;
        this.width = Math.floor(Math.random() * 300) + 100;
        this.height = this.width / 2 + 30;

        this.image = image;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.move();

        (this.x + this.width < 0) && this.reset();
    }

    move() { this.x -= 0.5; }
    moveRight(playerIsRunning) { (playerIsRunning) ? this.x += 1.5 : this.x += 1.5; }
    moveLeft() { this.x -= 1.5; }

    reset() {
        this.x = this.ctx.canvas.width + Math.floor(Math.random() * 1000);
        this.y = Math.floor(Math.random() * 100);
        this.width = Math.floor(Math.random() * 100) + 100;
        this.height = this.width / 2;
    }
}