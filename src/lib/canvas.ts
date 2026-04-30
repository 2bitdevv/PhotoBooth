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
  // Normalized from user-provided SVG path in viewBox 100x90.
  const sx = width / 100;
  const sy = height / 90;
  const px = (n: number) => x + n * sx;
  const py = (n: number) => y + n * sy;

  ctx.beginPath();
  // Taller, cleaner heart: less bottom drop so it doesn't look bulky.
  ctx.moveTo(px(50), py(76));
  ctx.lineTo(px(22), py(50));
  ctx.bezierCurveTo(px(8), py(36), px(16), py(16), px(35), py(16));
  ctx.bezierCurveTo(px(44), py(16), px(49), py(24), px(50), py(24));
  ctx.bezierCurveTo(px(51), py(24), px(56), py(16), px(65), py(16));
  ctx.bezierCurveTo(px(84), py(16), px(92), py(36), px(78), py(50));
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
    // Make heart frame visually comparable in size to other frame shapes.
    const scaleX = 1.2;
    const scaleY = 1.32;
    const expandedWidth = width * scaleX;
    const expandedHeight = height * scaleY;
    const offsetX = (expandedWidth - width) / 2;
    const offsetY = (expandedHeight - height) / 2;
    drawHeartPath(ctx, x - offsetX, y - offsetY, expandedWidth, expandedHeight);
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

function fillFrameBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameColor: string,
  photoShape: PhotoShape
) {
  if (photoShape !== "heart") {
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // Keep selected frame color as the base so color swatches still work in heart mode.
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, width, height);

  const baseGradient = ctx.createLinearGradient(0, 0, 0, height);
  baseGradient.addColorStop(0, "rgba(255, 255, 255, 0.24)");
  baseGradient.addColorStop(0.55, "rgba(255, 240, 246, 0.14)");
  baseGradient.addColorStop(1, "rgba(255, 255, 255, 0.28)");
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, width, height);

  const glowGradient = ctx.createRadialGradient(width * 0.5, height * 0.25, width * 0.05, width * 0.5, height * 0.25, width * 0.7);
  glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.24)");
  glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, width, height);
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

  fillFrameBackground(ctx, canvas.width, canvas.height, frameColor, photoShape);

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
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = photoBorderColor;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();

    if (photoShape === "heart") {
      // Soft inner depth to keep the heart slot dreamy and less flat.
      ctx.save();
      drawPhotoPath(ctx, photoShape, x, y, layout.imageWidth, layout.imageHeight);
      ctx.clip();
      const depthOverlay = ctx.createLinearGradient(x, y, x, y + layout.imageHeight);
      depthOverlay.addColorStop(0, "rgba(255,255,255,0.16)");
      depthOverlay.addColorStop(0.7, "rgba(255,255,255,0)");
      depthOverlay.addColorStop(1, "rgba(15,23,42,0.08)");
      ctx.fillStyle = depthOverlay;
      ctx.fillRect(x, y, layout.imageWidth, layout.imageHeight);
      ctx.restore();
    }
  }
  ctx.filter = "none";

  for (const sticker of stickers) {
    const half = sticker.size / 2;
    const x = Math.min(canvas.width - half, Math.max(half, sticker.x));
    const y = Math.min(canvas.height - half, Math.max(half, sticker.y));
    const stickerImage = await loadImage(sticker.stickerSrc);
    ctx.drawImage(stickerImage, x - half, y - half, sticker.size, sticker.size);
  }

  ctx.fillStyle = "rgba(71, 85, 105, 0.9)";
  ctx.font = "18px Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(`PhotoBoot ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height - 30);

  return canvas.toDataURL("image/png", 1);
}
