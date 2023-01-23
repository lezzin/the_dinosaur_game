import COLORS from "../game/colors.js";

export function img(file, src) {
  const image = new Image();

  image.src = `images/${src}/${file}`;
  return image;
}

export function writeTextOnCanvas(context, text, position, options = {}) {
  context.fillStyle = options.color ?? COLORS.normalFont;
  context.font = options.font ?? "16px Arial";
  context.textAlign = options.align ?? "center";
  context.fillText(text, position.x, position.y);

  if (!options.border) return;
  context.strokeStyle = COLORS.black;
  context.lineWidth = 0.8;
  context.strokeText(text, position.x, position.y);
}

export function drawBackgroundOnCanvas(context, color, isGradient = false) {
  if (isGradient) {
    context.fillStyle = context.createLinearGradient(0, 0, 0, 600)
    context.fillStyle.addColorStop(1, color.start);
    context.fillStyle.addColorStop(0, color.end);
  } else {
    context.fillStyle = color;
  }

  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}