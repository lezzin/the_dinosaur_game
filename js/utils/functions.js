import COLORS from "./colors.js";

export function img(file, src) {
  const image = new Image();

  image.src = `images/${src}/${file}`;
  return image;
}

export function writeTextOnCanvas(context, text, position, options = {}) {
  const { font, color, align, border } = options;

  // text
  context.fillStyle = color ?? COLORS.normalFont;
  context.font = font ?? "16px Arial";
  context.textAlign = align ?? "center";
  context.fillText(text, position.x, position.y);

  // border
  if (!border) return;
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

export function drawButtonOnCanvas(context, clickHandler, options, endHandler) {
  const { font, text, bgColor, color, borderColor, x, y, width, height, align, borderRadius, mobile } = options;
  const radius = borderRadius ?? 5;

  // border
  context.strokeStyle = borderColor ? borderColor : COLORS.black;
  context.lineWidth = 1;
  context.stroke();

  // border-radius and background
  context.fillStyle = color ?? COLORS.normalFont;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();

  // text 
  context.textBaseline = 'middle';
  context.font = font ?? "20px Arial";
  context.textAlign = align ?? "center";
  context.fillStyle = bgColor ?? COLORS.normalFont;
  context.fillText(text, x + width / 2, y + height / 2);

  context.textBaseline = 'alphabetic';

  const path = new Path2D();
  path.rect(x, y, width, height);

  if (mobile) {
    function start(event) {
      const rect = context.canvas.getBoundingClientRect();
      const touchX = event.touches[0].clientX - rect.left;
      const touchY = event.touches[0].clientY - rect.top;

      if (context.isPointInPath(path, touchX, touchY)) {
        clickHandler();
        document.removeEventListener('touchstart', start);
      }
    }

    function end(event) {
      const rect = context.canvas.getBoundingClientRect();
      const touchX = event.changedTouches[0].clientX - rect.left;
      const touchY = event.changedTouches[0].clientY - rect.top;

      if (context.isPointInPath(path, touchX, touchY)) {
        endHandler();
        document.removeEventListener('touchend', end);
      }
    }

    document.addEventListener('touchstart', start);
    document.addEventListener('touchend', end);
  } else {
    function check(event) {
      const rect = context.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (context.isPointInPath(path, mouseX, mouseY)) {
        clickHandler();
        document.removeEventListener('click', check);
      }
    }

    document.addEventListener('click', check);
  }
}
