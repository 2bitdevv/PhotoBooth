"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/Button";
import { mergeStripToDataUrl } from "@/lib/canvas";
import { FRAME_PRESETS, getFramePresetById } from "@/lib/framePresets";
import { getFilterCss } from "@/lib/filters";
import { STICKER_ASSETS } from "@/lib/stickerAssets";
import { useBoothStore, type StickerPlacement } from "@/store/useBoothStore";

const frameColorOptions = [
  { name: "Rainbow", value: "#fbcfe8", swatch: "conic-gradient(from 90deg, #60a5fa, #4ade80, #facc15, #fb7185, #a78bfa, #60a5fa)" },
  { name: "White", value: "#ffffff", swatch: "#ffffff" },
  { name: "Black", value: "#111827", swatch: "#111827" },
  { name: "Blush", value: "#fde2ef", swatch: "#fde2ef" },
  { name: "Pink", value: "#fbcfe8", swatch: "#fbcfe8" },
  { name: "Sky", value: "#bfdbfe", swatch: "#bfdbfe" },
  { name: "Lavender", value: "#c4b5fd", swatch: "#c4b5fd" },
  { name: "Lemon", value: "#fef08a", swatch: "#fef08a" },
  { name: "Peach", value: "#fed7aa", swatch: "#fed7aa" },
  { name: "Green", value: "#15803d", swatch: "#15803d" },
  { name: "Gray", value: "#a3a3a3", swatch: "#a3a3a3" },
  { name: "Brown", value: "#1c0d08", swatch: "#1c0d08" },
  { name: "Navy", value: "#0f1f7a", swatch: "#0f1f7a" },
  { name: "Wine", value: "#8b1120", swatch: "#8b1120" },
  { name: "Rosy", value: "#f9a8d4", swatch: "#f9a8d4" },
  { name: "Dark Cocoa", value: "#2c1408", swatch: "#2c1408" },
  { name: "Flower", value: "#ffe4e6", swatch: "radial-gradient(circle at 30% 30%, #fda4af 0 25%, transparent 26%), radial-gradient(circle at 75% 68%, #f9a8d4 0 23%, transparent 24%), #ffe4e6" },
  { name: "Mint Fade", value: "#ccfbf1", swatch: "linear-gradient(135deg, #fef9c3, #ccfbf1)" },
  { name: "Smoky", value: "#6b7280", swatch: "linear-gradient(180deg, #111827, #9ca3af)" },
  { name: "Silver", value: "#d1d5db", swatch: "radial-gradient(circle at 25% 25%, #f8fafc, #d1d5db 55%, #9ca3af)" },
  { name: "Sunset", value: "#60a5fa", swatch: "linear-gradient(135deg, #fb7185, #60a5fa)" },
  { name: "Aqua", value: "#67e8f9", swatch: "linear-gradient(135deg, #a7f3d0, #60a5fa)" },
] as const;

function ShapeIcon({ shape }: { shape: "rounded" | "circle" | "heart" }) {
  if (shape === "circle") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (shape === "heart") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.3A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CustomizeScreen() {
  const selectedLayout = useBoothStore((state) => state.selectedLayout);
  const capturedPhotos = useBoothStore((state) => state.capturedPhotos);
  const selectedFrameColor = useBoothStore((state) => state.selectedFrameColor);
  const setFrameColor = useBoothStore((state) => state.setFrameColor);
  const activeFilter = useBoothStore((state) => state.activeFilter);
  const addedStickers = useBoothStore((state) => state.addedStickers);
  const setStickers = useBoothStore((state) => state.setStickers);
  const setFinalMergedImage = useBoothStore((state) => state.setFinalMergedImage);
  const setCapturedPhotos = useBoothStore((state) => state.setCapturedPhotos);
  const setAppState = useBoothStore((state) => state.setAppState);
  const [activePresetId, setActivePresetId] = useState(FRAME_PRESETS[0].id);
  const [stickerMode, setStickerMode] = useState<"preset" | "none">("none");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const filterCss = useMemo(() => getFilterCss(activeFilter), [activeFilter]);
  const activePreset = useMemo(() => getFramePresetById(activePresetId), [activePresetId]);
  const effectivePhotoShape = stickerMode === "none" ? "rounded" : activePreset.photoShape;
  const effectivePhotoBorderColor = stickerMode === "none" ? "#ffffff" : activePreset.photoBorderColor;
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

  const buildPresetStickers = (presetId: (typeof FRAME_PRESETS)[number]["id"]): StickerPlacement[] => {
    const preset = getFramePresetById(presetId);
    return preset.stickers.map((stickerId, idx) => ({
      id: `${preset.id}-${stickerId}-${idx}`,
      stickerId,
      stickerSrc: STICKER_ASSETS[stickerId],
      x: selectedLayout.stripWidth * (0.18 + ((idx % 2) * 0.64)),
      y: stripHeight * (0.1 + idx * 0.24),
      size: 64,
    }));
  };

  const presetStickers = buildPresetStickers(activePreset.id).map((sticker) => ({
    ...sticker,
    ...clampSticker(sticker.x, sticker.y, sticker.size),
  }));
  const effectiveStickers =
    stickerMode === "none" ? [] : addedStickers.length > 0 ? addedStickers : presetStickers;

  const handleApplyFramePreset = (presetId: (typeof FRAME_PRESETS)[number]["id"]) => {
    const preset = getFramePresetById(presetId);
    setActivePresetId(presetId);
    setStickerMode("preset");
    setFrameColor(preset.frameColor);
    const placements = buildPresetStickers(presetId).map((sticker) => ({
      ...sticker,
      ...clampSticker(sticker.x, sticker.y, sticker.size),
    }));
    setStickers(placements);
  };

  useEffect(() => {
    const run = async () => {
      const dataUrl = await mergeStripToDataUrl({
        photos: capturedPhotos,
        layout: selectedLayout,
        frameColor: selectedFrameColor,
        stickers: [],
        filterCss,
        photoShape: effectivePhotoShape,
        photoBorderColor: effectivePhotoBorderColor,
      });
      setPreviewImage(dataUrl);
    };
    void run();
  }, [capturedPhotos, effectivePhotoBorderColor, effectivePhotoShape, filterCss, selectedFrameColor, selectedLayout]);

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
    if (stickerMode === "none" || !draggingId || !previewCanvasRef.current) return;
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * selectedLayout.stripWidth;
    const y = ((event.clientY - rect.top) / rect.height) * stripHeight;
    const sourceStickers = addedStickers.length > 0 ? addedStickers : presetStickers;
    setStickers(
      sourceStickers.map((sticker) =>
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
        stickers: effectiveStickers,
        filterCss,
        photoShape: effectivePhotoShape,
        photoBorderColor: effectivePhotoBorderColor,
      });
      setFinalMergedImage(dataUrl);
      setAppState("RESULT");
    };
    void run();
  };

  const goBackToCapture = () => {
    setFinalMergedImage(null);
    setAppState("CAPTURE");
  };

  const retakeAllPhotos = () => {
    setCapturedPhotos([]);
    setStickers([]);
    setFrameColor("#ffffff");
    setFinalMergedImage(null);
    setAppState("CAPTURE");
  };

  return (
    <section className="mx-auto mt-0 max-w-6xl px-4 pb-12">
      <div className="mb-3 flex flex-wrap gap-2">
        <Button onClick={goBackToCapture}>Back to Capture</Button>
        <Button onClick={retakeAllPhotos}>Retake All</Button>
      </div>
      <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">Photo Strip Preview</h2>
      <div className="mx-auto mt-3 inline-block rounded-xl bg-pink-100/60 px-4 py-2">
        <p className="text-sm text-slate-700">
          Layout: {selectedLayout.name} ({selectedLayout.poses} photos)
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-start justify-center gap-6">
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
                {effectiveStickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onPointerDown={() => handleStickerPointerDown(sticker.id)}
                    className="absolute z-10 cursor-grab active:cursor-grabbing"
                    style={{
                      left: `${(sticker.x / selectedLayout.stripWidth) * 100}%`,
                      top: `${(sticker.y / stripHeight) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <img
                      src={sticker.stickerSrc}
                      alt={sticker.stickerId}
                      className="pointer-events-none block h-auto w-auto"
                      style={{ width: `${sticker.size}px`, height: `${sticker.size}px` }}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p>Generating preview...</p>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600">Tip: drag stickers on the preview before generating.</p>
        </div>

        <aside className="-mt-6 flex flex-[1_1_300px] flex-col rounded-xl p-2">
        <h3 className="text-2xl font-black text-slate-800">Customize your strip</h3>
        <div className="mt-1">
          <p className="mb-2 text-center text-sm font-bold text-slate-700">Frame Colors</p>
          <div className="grid grid-cols-11 gap-2">
            {frameColorOptions.map((color) => {
              const isActive = selectedFrameColor.toLowerCase() === color.value.toLowerCase();
              return (
                <button
                  key={`${color.name}-${color.value}`}
                  type="button"
                  onClick={() => setFrameColor(color.value)}
                  className="h-8 w-8 rounded-lg border transition"
                  title={color.name}
                  aria-label={`frame color ${color.name}`}
                  style={{
                    borderColor: isActive ? "#f43f5e" : "#d1d5db",
                    boxShadow: isActive ? "0 0 0 2px #fb7185" : "none",
                    background: color.swatch,
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-2">
          <p className="mb-2 text-center text-sm font-bold text-slate-700">Stickers</p>
          <div className="grid max-h-[300px] grid-cols-4 gap-2 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => {
                setStickerMode("none");
                setDraggingId(null);
                setStickers([]);
                setFrameColor("#ffffff");
              }}
              className="relative h-16 w-full rounded-xl border transition"
              title="No Sticker"
              aria-label="no sticker"
              style={{
                borderColor: stickerMode === "none" ? "#f43f5e" : "#d1d5db",
                background: "#f3f4f6",
                boxShadow: stickerMode === "none" ? "0 0 0 2px #fb7185" : "none",
              }}
            >
              <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {FRAME_PRESETS.map((preset) => {
              const isActive = stickerMode === "preset" && activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyFramePreset(preset.id)}
                  className="relative h-16 w-full rounded-xl border transition"
                  title={preset.name}
                  aria-label={`preset ${preset.name}`}
                  style={{
                    borderColor: isActive ? "#f43f5e" : "#d1d5db",
                    background: preset.panelBg,
                    boxShadow: isActive ? "0 0 0 2px #fb7185" : "none",
                  }}
                >
                  <img
                    src={STICKER_ASSETS[preset.stickers[0]]}
                    alt=""
                    aria-hidden="true"
                    className="mx-auto h-9 w-9"
                  />
                  <span className="absolute right-1.5 top-1.5 text-slate-500">
                    <ShapeIcon shape={preset.photoShape} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <Button variant="primary" className="mt-4 w-full py-3 text-lg" onClick={goToResult}>
          Generate Final Strip
        </Button>
        </aside>
      </div>
    </section>
  );
}
