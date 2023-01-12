function img(file, src) {
  const image = new Image();

  image.src = `images/${src}/${file}`;
  return image;
}

function writeText(ctx, options, text, position) {
  ctx.fillStyle = options.color ?? "#fff";
  ctx.font = options.font ?? "16px Arial";
  ctx.textAlign = options.align ?? "center";
  ctx.fillText(text, position.x, position.y);
}

export { img, writeText };