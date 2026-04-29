"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/Button";
import { mergeStripToDataUrl } from "@/lib/canvas";
import { getFilterCss } from "@/lib/filters";
import { useBoothStore, type StickerPlacement } from "@/store/useBoothStore";

const frameColors = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#111827" },
  { name: "Light Blue", value: "#bfdbfe" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Sky", value: "#7dd3fc" },
  { name: "Mint", value: "#a7f3d0" },
  { name: "Lilac", value: "#c4b5fd" },
  { name: "Peach", value: "#fed7aa" },
  { name: "Rose", value: "#fecdd3" },
  { name: "Slate", value: "#94a3b8" },
  { name: "Cream", value: "#fef3c7" },
  { name: "Teal", value: "#2dd4bf" },
];

const stickerSets: { name: string; stickers: string[] }[] = [
  { name: "No Stickers", stickers: [] },
  { name: "Cute", stickers: ["✨", "💖", "🎀"] },
  { name: "Party", stickers: ["🎉", "🎈", "⭐"] },
];

export function CustomizeScreen() {
  const selectedLayout = useBoothStore((state) => state.selectedLayout);
  const capturedPhotos = useBoothStore((state) => state.capturedPhotos);
  const selectedFrameColor = useBoothStore((state) => state.selectedFrameColor);
  const setFrameColor = useBoothStore((state) => state.setFrameColor);
  const activeFilter = useBoothStore((state) => state.activeFilter);
  const addedStickers = useBoothStore((state) => state.addedStickers);
  const setStickers = useBoothStore((state) => state.setStickers);
  const setFinalMergedImage = useBoothStore((state) => state.setFinalMergedImage);
  const setAppState = useBoothStore((state) => state.setAppState);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const filterCss = useMemo(() => getFilterCss(activeFilter), [activeFilter]);
  const isWidePreviewLayout = selectedLayout.poses === 2 || selectedLayout.poses === 4;

  const stripHeight = useMemo(() => {
    return selectedLayout.stripHeight;
  }, [selectedLayout]);

  const clampSticker = (x: number, y: number, size: number) => {
    const half = size / 2;
    return {
      x: Math.min(selectedLayout.stripWidth - half, Math.max(half, x)),
      y: Math.min(stripHeight - half, Math.max(half, y)),
    };
  };

  useEffect(() => {
    const run = async () => {
      const dataUrl = await mergeStripToDataUrl({
        photos: capturedPhotos,
        layout: selectedLayout,
        frameColor: selectedFrameColor,
        stickers: [],
        filterCss,
      });
      setPreviewImage(dataUrl);
    };
    void run();
  }, [addedStickers, capturedPhotos, filterCss, selectedFrameColor, selectedLayout]);

  const handleApplyStickerSet = (stickers: string[]) => {
    const placements: StickerPlacement[] = stickers.map((emoji, idx) => ({
      id: `${emoji}-${idx}`,
      emoji,
      x: selectedLayout.stripWidth * (0.25 + idx * 0.15),
      y: stripHeight * (0.2 + idx * 0.1),
      size: 48,
    }));
    setStickers(placements.map((sticker) => ({ ...sticker, ...clampSticker(sticker.x, sticker.y, sticker.size) })));
  };

  useEffect(() => {
    if (!previewImage || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = previewImage;
  }, [previewImage]);

  const handleStickerPointerDown = (id: string) => {
    setDraggingId(id);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingId || !previewCanvasRef.current) return;
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * selectedLayout.stripWidth;
    const y = ((event.clientY - rect.top) / rect.height) * stripHeight;
    setStickers(
      addedStickers.map((sticker) =>
        sticker.id === draggingId
          ? {
              ...sticker,
              ...clampSticker(x, y, sticker.size),
            }
          : sticker
      )
    );
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const goToResult = () => {
    const run = async () => {
      const dataUrl = await mergeStripToDataUrl({
        photos: capturedPhotos,
        layout: selectedLayout,
        frameColor: selectedFrameColor,
        stickers: addedStickers,
        filterCss,
      });
      setFinalMergedImage(dataUrl);
      setAppState("RESULT");
    };
    void run();
  };

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 pb-12">
      <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">Photo Strip Preview</h2>
      <div className="mx-auto mt-3 inline-block rounded-xl bg-pink-100/60 px-4 py-2">
        <p className="text-sm text-slate-700">
          Layout: {selectedLayout.name} ({selectedLayout.poses} photos)
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-start justify-center gap-6">
        <div className="flex flex-[1_1_500px] flex-col items-center lg:mr-5">
          <div
            className="relative w-full bg-transparent p-0"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {previewImage ? (
              <div
                className={`relative mx-auto w-full ${
                  isWidePreviewLayout ? "max-w-[300px]" : "max-w-[240px]"
                }`}
              >
                <canvas
                  ref={previewCanvasRef}
                  className="photo-strip block h-auto w-full rounded-[10px] border border-[#ddd] shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                  width={selectedLayout.stripWidth}
                  height={stripHeight}
                />
                {addedStickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onPointerDown={() => handleStickerPointerDown(sticker.id)}
                    className="absolute z-10 cursor-grab active:cursor-grabbing"
                    style={{
                      left: `${(sticker.x / selectedLayout.stripWidth) * 100}%`,
                      top: `${(sticker.y / stripHeight) * 100}%`,
                      fontSize: `${Math.max(28, sticker.size * 0.65)}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
            ) : (
              <p>Generating preview...</p>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600">Tip: drag stickers on the preview before generating.</p>
        </div>

        <aside className="flex flex-[1_1_300px] flex-col rounded-xl p-2">
        <h3 className="text-2xl font-black text-slate-800">Customize your strip</h3>
        <div className="mt-6">
          <p className="mb-2 font-semibold text-slate-700">Frame Color</p>
          <div className="grid grid-cols-2 gap-2">
            {frameColors.map((color) => (
              <Button
                key={color.value}
                variant={selectedFrameColor === color.value ? "primary" : "default"}
                onClick={() => setFrameColor(color.value)}
              >
                {color.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <p className="mb-2 font-semibold text-slate-700">Stickers</p>
          <div className="grid grid-cols-2 gap-2">
            {stickerSets.map((set) => (
              <Button key={set.name} onClick={() => handleApplyStickerSet(set.stickers)}>
                {set.name}
              </Button>
            ))}
          </div>
        </div>
        <Button variant="primary" className="mt-8 w-full py-3 text-lg" onClick={goToResult}>
          Generate Final Strip
        </Button>
        </aside>
      </div>
    </section>
  );
}
