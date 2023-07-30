import { img } from "../functions.js";
import colors from "./colors.js";
import { CLOUD_VELOCITIES } from "./constants.js";

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
            new Cloud(this.context, "cloud1.png"),
            new Cloud(this.context, "cloud2.png"),
            new Cloud(this.context, "cloud3.png"),
        ].sort((firstCloud, secondCloud) => firstCloud.defaultWidth - secondCloud.defaultWidth);
    }

    draw() {
        this.drawGround();
        this.drawClouds();
    }

    drawGround() {
        this.context.fillStyle = colors.ground;
        this.context.fillRect(0, this.context.canvas.height - 63, this.context.canvas.width, 63);

        this.context.strokeStyle = colors.darkGround;
        this.context.lineWidth = 3;
        this.context.beginPath();
        this.context.moveTo(0, this.context.canvas.height - 64);
        this.context.lineTo(this.context.canvas.width, this.context.canvas.height - 64);
        this.context.stroke();
    }

    drawClouds() {
        for (const cloud of this.clouds) {
            cloud.draw();

            if (this.cloudCanMoveRight) cloud.moveRight();
            if (this.cloudCanMoveLeft) cloud.moveLeft(this.playerIsRunning);

            if (cloud.outOfBounds()) cloud.reset();
        }
    }

    reset() {
        for (const cloud of this.clouds) cloud.reset();
    }
}

class Cloud {
    constructor(context, imageName) {
        this.context = context;

        this.x = Math.floor(Math.random() * 800) + context.canvas.width;
        this.y = (this.context.canvas.height / 3) + Math.floor(Math.random() * 5);
        this.width = Math.floor(Math.random() * 300);
        this.height = this.width / 2 + 30;

        this.defaultWidth = this.width;
        this.defaultHeight = this.height;

        this.image = img(imageName, "scenaries");
    }

    draw() {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.move();

        if (this.x + this.width < 0) this.reset();
    }

    move() {
        this.x -= CLOUD_VELOCITIES.normal(this.width);
    }

    moveLeft(playerIsRunning) {
        if (playerIsRunning) {
            this.x -= CLOUD_VELOCITIES.running(this.width);
        } else {
            this.x -= CLOUD_VELOCITIES.normal(this.width);
        }
    }

    moveRight() {
        this.x += CLOUD_VELOCITIES.normal(this.width);
    }

    reset() {
        this.x = Math.floor(Math.random() * 1000) + this.context.canvas.width;
        this.y = Math.floor(Math.random() * 250);
    }

    outOfBounds() {
        return this.x + this.width < 0;
    }
}
