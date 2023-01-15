import { img } from "../utils/functions.js";
import colors from "./colors.js";

const CLOUD_VELOCITIES = {
    normal: (width) => 0.2 * Math.floor(width / 100),
    running: (width) => 0.4 * Math.floor(width / 100),
}

export default class Scenaries {
    cloudCanMoveRight = false;
    cloudCanMoveLeft = false;
    playerIsRunning = false;

    constructor(context) {
        this.context = context;

        this.x = 0;
        this.y = 0;

        this.width = context.canvas.width;
        this.height = context.canvas.height;

        this.clouds = [
            new Cloud(this.context, img("cloud1.png", "scenaries")),
            new Cloud(this.context, img("cloud1.png", "scenaries")),
            new Cloud(this.context, img("cloud1.png", "scenaries")),
            new Cloud(this.context, img("cloud2.png", "scenaries")),
            new Cloud(this.context, img("cloud2.png", "scenaries")),
            new Cloud(this.context, img("cloud2.png", "scenaries")),
            new Cloud(this.context, img("cloud3.png", "scenaries")),
            new Cloud(this.context, img("cloud3.png", "scenaries")),
            new Cloud(this.context, img("cloud3.png", "scenaries")),
        ].sort((firstCloud, secondCloud) => firstCloud.defaultWidth - secondCloud.defaultWidth);
    }

    draw() {
        this.#drawGround();
        this.#drawClouds();
    }

    #drawGround() {
        this.context.fillStyle = colors.ground;
        this.context.fillRect(0, this.context.canvas.height - 25.5, this.context.canvas.width, 26);

        this.context.strokeStyle = colors.darkGround;
        this.context.lineWidth = 3;
        this.context.beginPath();
        this.context.moveTo(0, this.context.canvas.height - 25.5);
        this.context.lineTo(this.context.canvas.width, this.context.canvas.height - 25.5);
        this.context.stroke();
    }

    #drawClouds() {
        for (const cloud of this.clouds) {
            cloud.draw();

            this.cloudCanMoveRight && cloud.moveRight();
            this.cloudCanMoveLeft && cloud.moveLeft(this.playerIsRunning);

            const cloudPassedCanvasRightBorder = cloud.x + cloud.width < 0;
            cloudPassedCanvasRightBorder && cloud.reset();
        };
    }

    reset() {
        for (const cloud of this.clouds) cloud.reset();
    }
}

class Cloud {
    constructor(context, image) {
        this.context = context;

        this.x = Math.floor(Math.random() * 1000) + context.canvas.width;
        this.y = Math.floor(Math.random() * 250);
        this.width = Math.floor(Math.random() * 400) + 100;
        this.height = this.width / 2 + 30;

        this.image = image;
    }

    draw() {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.move();

        (this.x + this.width < 0) && this.reset();
    }

    move() {
        this.x -= CLOUD_VELOCITIES.normal(this.width);
    }

    moveLeft(playerIsRunning) {
        if (playerIsRunning) {
            this.x -= CLOUD_VELOCITIES.running(this.width);
            return;
        }

        this.x -= CLOUD_VELOCITIES.normal(this.width);
    }

    moveRight() {
        this.x += CLOUD_VELOCITIES.normal(this.width);
    }

    reset() {
        this.x = Math.floor(Math.random() * 1000) + this.context.canvas.width;
        this.y = Math.floor(Math.random() * 250);
    }
}