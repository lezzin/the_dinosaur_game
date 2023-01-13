import { img } from "../utils/functions.js";
import colors from "./colors.js";

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
        this.ctx.fillStyle = colors.ground;
        this.ctx.fillRect(0, this.ctx.canvas.height - 25.5, this.ctx.canvas.width, 26);
        // overline on ground
        this.ctx.strokeStyle = colors.darkGround;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.ctx.canvas.height - 25.5);
        this.ctx.lineTo(this.ctx.canvas.width, this.ctx.canvas.height - 25.5);
        this.ctx.stroke();

        // clouds
        for (const cloud of this.clouds) {
            cloud.draw();

            this.cloudCanMoveRight && cloud.moveRight();
            this.cloudCanMoveLeft && cloud.moveLeft(this.playerIsRunning);

            const cloudPassedCanvasRightBorder = cloud.x + cloud.width < 0;
            cloudPassedCanvasRightBorder && cloud.reset();
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
        this.y = Math.floor(Math.random() * 250);
        this.width = Math.floor(Math.random() * 400);
        this.height = this.width / 2 + 30;

        this.image = image;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.move();

        (this.x + this.width < 0) && this.reset();
    }

    move() {
        this.x -= 0.5 * (this.width / 100);
    }

    moveLeft(playerIsRunning) {
        playerIsRunning ? this.x -= 0.6 * (this.width / 100) : this.x -= 0.2 * (this.width / 100);
    }

    moveRight() {
        this.x += 0.8 * (this.width / 100);
    }

    reset() {
        this.x = this.ctx.canvas.width + Math.floor(Math.random() * 1000);
        this.y = Math.floor(Math.random() * 250);
        this.width = Math.floor(Math.random() * 300) + 100;
        this.height = this.width / 2 + 30;
    }
}