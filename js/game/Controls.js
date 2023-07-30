import { drawBackgroundOnCanvas, drawButtonOnCanvas } from "../functions.js";
import colors from "./colors.js";

export default class Controls {
    isShowing = false;

    constructor(context, player) {
        this.context = context;
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;

        this.player = player;
    }

    resize() {
        const mobileResolution = 768;

        this.isShowing = this.context.canvas.style.display == "block";

        if (innerWidth < mobileResolution) {
            this.show();
        } else {
            this.hide();
        }
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
                color: colors.normalFont,
                bgColor: colors.dangerFont,
                x: this.width / 2 - 30,
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
                text: "Run",
                color: colors.normalFont,
                bgColor: colors.dangerFont,
                x: this.width / 2 - 30,
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
                color: colors.normalFont,
                bgColor: colors.dangerFont,
                x: 30 - 5,
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
                color: colors.normalFont,
                bgColor: colors.dangerFont,
                x: 150 + 5,
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