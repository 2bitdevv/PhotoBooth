import type { LayoutConfig } from "@/lib/layouts";
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

export async function mergeStripToDataUrl({
  photos,
  layout,
  frameColor,
  stickers,
  filterCss,
}: {
  photos: string[];
  layout: LayoutConfig;
  frameColor: string;
  stickers: StickerPlacement[];
  filterCss: string;
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
    ctx.drawImage(img, x, y, layout.imageWidth, layout.imageHeight);
  }
  ctx.filter = "none";

  for (const sticker of stickers) {
    const half = sticker.size / 2;
    const x = Math.min(canvas.width - half, Math.max(half, sticker.x));
    const y = Math.min(canvas.height - half, Math.max(half, sticker.y));
    ctx.font = `${sticker.size}px sans-serif`;
    ctx.fillText(sticker.emoji, x, y);
  }

  ctx.fillStyle = "#0f172a";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`PhotoBoot ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height - 30);

  return canvas.toDataURL("image/png", 1);
}
