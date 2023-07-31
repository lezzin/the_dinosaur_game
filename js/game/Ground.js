import colors from "../utils/colors.js";

export default class Ground {
    constructor(context) {
        this.context = context;
        this.x = 0;
        this.y = 0;
        this.width = context.canvas.width;
        this.height = context.canvas.height;
    }

    draw() {
        this.context.fillStyle = colors.ground;
        this.context.fillRect(0, this.context.canvas.height - 63, this.context.canvas.width, 63);

        this.context.strokeStyle = colors.darkGround;
        this.context.lineWidth = 3;
        this.context.beginPath();
        this.context.moveTo(0, this.context.canvas.height - 64);
        this.context.lineTo(this.context.canvas.width, this.context.canvas.height - 64);
        this.context.stroke();
    }
}
