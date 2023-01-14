import { img } from "../utils/functions.js";
import colors from "./colors.js";

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
            new Cloud(this.context, img("cloud2.png", "scenaries")),
            new Cloud(this.context, img("cloud3.png", "scenaries")),
            new Cloud(this.context, img("cloud1.png", "scenaries")),
            new Cloud(this.context, img("cloud2.png", "scenaries")),
            new Cloud(this.context, img("cloud2.png", "scenaries")),
            new Cloud(this.context, img("cloud3.png", "scenaries")),
            new Cloud(this.context, img("cloud3.png", "scenaries")),
            new Cloud(this.context, img("cloud1.png", "scenaries")),
        ].sort((firstCloud, secondCloud) => firstCloud.defaultWidth - secondCloud.defaultWidth);
    }

    draw() {
        this.#drawFloor();
        this.#drawClouds();
    }

    #drawFloor() {
        this.context.fillStyle = colors.floor;
        this.context.fillRect(0, this.context.canvas.height - 25.5, this.context.canvas.width, 26);
        this.context.strokeStyle = colors.darkGround;
        this.context.lineWidth = 3;
        this.context.beginPath();
        this.context.moveTo(0, this.context.canvas.height - 25.5);
        this.context.lineTo(this.context.canvas.width, this.context.canvas.height - 25.5);
        this.context.stroke();
    }

    #drawClouds() {
        this.clouds.forEach(cloud => {
            cloud.draw();

            this.cloudCanMoveRight && cloud.moveRight();
            this.cloudCanMoveLeft && cloud.moveLeft(this.playerIsRunning);

            const cloudPassedCanvasRightBorder = cloud.x + cloud.width < 0;
            cloudPassedCanvasRightBorder && cloud.reset();
        });
    }

    reset() {
        this.clouds.forEach(cloud => cloud.reset());
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
        this.x -= 0.2 * (Math.ceil(this.width / 100));
    }

    moveLeft(playerIsRunning) {
        playerIsRunning ? this.x -= 0.4 * (this.width / 100) : this.x -= 0.2 * (Math.ceil(this.width / 100));
    }

    moveRight() {
        this.x += 0.2 * (Math.ceil(this.width / 100));
    }

    reset() {
        this.x = Math.floor(Math.random() * 1000) + this.context.canvas.width;
        this.y = Math.floor(Math.random() * 250);
    }
}