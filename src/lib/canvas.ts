import type { LayoutConfig } from "@/lib/layouts";
import type { PhotoShape } from "@/lib/framePresets";
import type { StickerPlacement } from "@/store/useBoothStore";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawHeartPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const topY = y + height * 0.25;
  const bottomY = y + height;
  const centerX = x + width / 2;
  const leftX = x;
  const rightX = x + width;

  ctx.beginPath();
  ctx.moveTo(centerX, bottomY);
  ctx.bezierCurveTo(centerX - width * 0.48, y + height * 0.72, leftX, y + height * 0.42, leftX, topY);
  ctx.bezierCurveTo(leftX, y, centerX - width * 0.15, y, centerX, y + height * 0.24);
  ctx.bezierCurveTo(centerX + width * 0.15, y, rightX, y, rightX, topY);
  ctx.bezierCurveTo(rightX, y + height * 0.42, centerX + width * 0.48, y + height * 0.72, centerX, bottomY);
  ctx.closePath();
}

function drawPhotoPath(
  ctx: CanvasRenderingContext2D,
  shape: PhotoShape,
  x: number,
  y: number,
  width: number,
  height: number
) {
  if (shape === "circle") {
    const radius = Math.min(width, height) / 2;
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    return;
  }
  if (shape === "heart") {
    drawHeartPath(ctx, x, y, width, height);
    return;
  }
  drawRoundedRectPath(ctx, x, y, width, height, 20);
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number
) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (sourceWidth === 0 || sourceHeight === 0) return;

  const sourceAspect = sourceWidth / sourceHeight;
  const destAspect = dWidth / dHeight;

  let sx = 0;
  let sy = 0;
  let sWidth = sourceWidth;
  let sHeight = sourceHeight;

  // Crop to fill destination without stretching (CSS object-fit: cover behavior).
  if (sourceAspect > destAspect) {
    sWidth = sourceHeight * destAspect;
    sx = (sourceWidth - sWidth) / 2;
  } else {
    sHeight = sourceWidth / destAspect;
    sy = (sourceHeight - sHeight) / 2;
  }

  ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

export async function mergeStripToDataUrl({
  photos,
  layout,
  frameColor,
  stickers,
  filterCss,
  photoShape = "rounded",
  photoBorderColor = "#ffffff",
}: {
  photos: string[];
  layout: LayoutConfig;
  frameColor: string;
  stickers: StickerPlacement[];
  filterCss: string;
  photoShape?: PhotoShape;
  photoBorderColor?: string;
}): Promise<string> {
  const canvas = document.createElement("canvas");
  const cols = layout.columns;

  canvas.width = layout.stripWidth;
  canvas.height = layout.stripHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const frameInnerWidth = cols * layout.imageWidth + (cols - 1) * layout.gap;
  const startX = (layout.stripWidth - frameInnerWidth) / 2;
  const startY = layout.padding;

  ctx.filter = filterCss;
  for (let i = 0; i < photos.length && i < layout.poses; i += 1) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = startX + col * (layout.imageWidth + layout.gap);
    const y = startY + row * (layout.imageHeight + layout.gap);
    const img = await loadImage(photos[i]);
    ctx.save();
    drawPhotoPath(ctx, photoShape, x, y, layout.imageWidth, layout.imageHeight);
    ctx.clip();
    drawImageCover(ctx, img, x, y, layout.imageWidth, layout.imageHeight);
    ctx.restore();

    ctx.save();
    drawPhotoPath(ctx, photoShape, x, y, layout.imageWidth, layout.imageHeight);
    ctx.strokeStyle = photoBorderColor;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();
  }
  ctx.filter = "none";

  for (const sticker of stickers) {
    const half = sticker.size / 2;
    const x = Math.min(canvas.width - half, Math.max(half, sticker.x));
    const y = Math.min(canvas.height - half, Math.max(half, sticker.y));
    const stickerImage = await loadImage(sticker.stickerSrc);
    ctx.drawImage(stickerImage, x - half, y - half, sticker.size, sticker.size);
  }

  ctx.fillStyle = "#0f172a";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`PhotoBoot ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height - 30);

  return canvas.toDataURL("image/png", 1);
}
