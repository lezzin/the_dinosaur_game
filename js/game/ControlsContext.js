import { drawButtonOnCanvas } from "../utils/functions.js";
import colors from "../utils/colors.js";

export default class ControlsContext {
    isShowing = false;

    constructor(context, player) {
        this.context = context;
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;

        this.player = player;

        this.draw();
    }

    resize() {
        const mobileResolution = 768;

        (innerWidth <= mobileResolution) ? this.show() : this.hide();
        this.isShowing = this.context.canvas.style.display == "block";
    }

    show() {
        this.context.canvas.style.display = "block";
    }

    hide() {
        this.context.canvas.style.display = "none";
    }

    draw() {
        drawButtonOnCanvas(
            this.context,
            () => {
                this.player.keydown({ code: "ArrowUp" })
            },
            {
                text: "Jump",
                color: colors.successFont,
                bgColor: colors.normalFont,
                x: 0,
                y: this.height / 2 - 60,
                width: 60,
                height: 60,
                mobile: true,
            },
            () => {
                this.player.keyup({ code: "ArrowUp" });
            },
        );

        drawButtonOnCanvas(
            this.context,
            () => {
                this.player.runPressed = !this.player.runPressed;
            },
            {
                text: this.player.runPressed ? "Walk" : "Run",
                color: colors.successFont,
                bgColor: colors.normalFont,
                x: 0,
                y: this.height / 2 + 5,
                width: 60,
                height: 60
            }
        );

        drawButtonOnCanvas(
            this.context,
            () => {
                this.player.keydown({ code: "ArrowLeft" })
            },
            {
                text: "Left",
                color: colors.successFont,
                bgColor: colors.normalFont,
                x: this.width - 180,
                y: this.height / 2 + 5,
                width: 60,
                height: 60,
                mobile: true
            },
            () => {
                this.player.keyup({ code: "ArrowLeft" })
            },
        );

        drawButtonOnCanvas(
            this.context,
            () => {
                this.player.keydown({ code: "ArrowRight" })
            },
            {
                text: "Right",
                color: colors.successFont,
                bgColor: colors.normalFont,
                x: this.width - 60,
                y: this.height / 2 + 5,
                width: 60,
                height: 60,
                mobile: true
            },
            () => {
                this.player.keyup({ code: "ArrowRight" });
            },
        );
    }
}