import colors from "../game/colors.js";

export function img(file, src) {
  const image = new Image();

  image.src = `images/${src}/${file}`;
  return image;
}

export function writeTextOnCanvas(context, text, position, options = {}) {
  context.fillStyle = options.color ?? colors.normalFont;
  context.font = options.font ?? "16px Arial";
  context.textAlign = options.align ?? "center";
  context.fillText(text, position.x, position.y);

  if (!options.border) return;
  context.strokeStyle = colors.black;
  context.lineWidth = 0.8;
  context.strokeText(text, position.x, position.y);
}