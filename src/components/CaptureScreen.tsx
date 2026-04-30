"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Webcam from "react-webcam";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FILTERS, getFilterCss } from "@/lib/filters";
import { mergeStripToDataUrl } from "@/lib/canvas";
import { useBoothStore } from "@/store/useBoothStore";

const videoConstraints = {
  facingMode: "user",
  aspectRatio: 16 / 9,
  width: { ideal: 1280 },
  height: { ideal: 720 },
};

export function CaptureScreen() {
  const webcamRef = useRef<Webcam | null>(null);
  const selectedLayout = useBoothStore((state) => state.selectedLayout);
  const capturedPhotos = useBoothStore((state) => state.capturedPhotos);
  const addCapturedPhoto = useBoothStore((state) => state.addCapturedPhoto);
  const setCapturedPhotos = useBoothStore((state) => state.setCapturedPhotos);
  const setStickers = useBoothStore((state) => state.setStickers);
  const setFinalMergedImage = useBoothStore((state) => state.setFinalMergedImage);
  const setFrameColor = useBoothStore((state) => state.setFrameColor);
  const setAppState = useBoothStore((state) => state.setAppState);
  const activeFilter = useBoothStore((state) => state.activeFilter);
  const setFilter = useBoothStore((state) => state.setFilter);
  const countdownSeconds = useBoothStore((state) => state.countdownSeconds);
  const setCountdownSeconds = useBoothStore((state) => state.setCountdownSeconds);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState<"camera" | "upload">("camera");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [livePreview, setLivePreview] = useState<string | null>(null);
  const captureComplete = capturedPhotos.length >= selectedLayout.poses;
  const shotProgressText = `${capturedPhotos.length} / ${selectedLayout.poses}`;

  const filterCss = useMemo(() => getFilterCss(activeFilter), [activeFilter]);

  useEffect(() => {
    const run = async () => {
      if (capturedPhotos.length === 0) {
        setLivePreview(null);
        return;
      }
      const dataUrl = await mergeStripToDataUrl({
        photos: capturedPhotos,
        layout: selectedLayout,
        frameColor: "#ffffff",
        stickers: [],
        filterCss,
      });
      setLivePreview(dataUrl);
    };
    void run();
  }, [capturedPhotos, filterCss, selectedLayout]);

  const handleRetake = () => {
    setCapturedPhotos([]);
    setStickers([]);
    setFinalMergedImage(null);
    setFrameColor("#ffffff");
    setAppState("CAPTURE");
  };

  const startCapture = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    const remaining = selectedLayout.poses - capturedPhotos.length;

    for (let i = 0; i < remaining; i += 1) {
      for (let s = countdownSeconds; s > 0; s -= 1) {
        setCountdown(s);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const screenshot = webcamRef.current?.getScreenshot();
      if (screenshot) {
        addCapturedPhoto(screenshot);
      }
      setCountdown(null);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setIsCapturing(false);
  }, [
    addCapturedPhoto,
    capturedPhotos.length,
    countdownSeconds,
    isCapturing,
    selectedLayout.poses,
  ]);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });

  const handleUploadFiles = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      if (files.length === 0) return;

      if (files.length !== selectedLayout.poses) {
        setUploadError(`This layout requires exactly ${selectedLayout.poses} images.`);
        return;
      }

      setIsUploading(true);
      setUploadError(null);
      try {
        const uploaded = await Promise.all(files.map((file) => fileToDataUrl(file)));
        setCapturedPhotos(uploaded);
      } catch {
        setUploadError("Some images could not be read. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [selectedLayout.poses, setCapturedPhotos]
  );

  return (
    <section className="mx-auto mt-2 max-w-7xl px-4 pb-6">
      <div className="mb-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setAppState("LAYOUT_SELECT")}>Back to Layout</Button>
          <Button onClick={handleRetake}>Retake All</Button>
          <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            Layout {selectedLayout.id} • {shotProgressText}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              <Button variant={captureMode === "camera" ? "primary" : "default"} onClick={() => setCaptureMode("camera")}>
                Camera
              </Button>
              <Button variant={captureMode === "upload" ? "primary" : "default"} onClick={() => setCaptureMode("upload")}>
                Upload Images
              </Button>
            </div>

            {captureMode === "camera" && (
              <div className="mb-3 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-2.5">
                <label htmlFor="timer" className="text-sm font-semibold text-slate-700">
                  Countdown
                </label>
                <select
                  id="timer"
                  className="rounded-lg border-2 border-slate-800 bg-white px-2 py-1"
                  value={countdownSeconds}
                  onChange={(event) => setCountdownSeconds(Number(event.target.value))}
                >
                  <option value={3}>3s</option>
                  <option value={4}>4s</option>
                  <option value={5}>5s</option>
                </select>
              </div>
            )}

            <div className="relative h-[clamp(280px,52vh,560px)] w-full overflow-hidden rounded-2xl border-2 border-slate-900 bg-black shadow-[6px_6px_0_0_#1e293b]">
              {captureMode === "camera" ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    mirrored
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.95}
                    forceScreenshotSourceSize
                    videoConstraints={videoConstraints}
                    className="h-full w-full"
                    style={{ filter: filterCss, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <AnimatePresence>
                    {countdown !== null && (
                      <motion.div
                        key={countdown}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.4, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white sm:text-8xl"
                      >
                        <span className="rounded-3xl bg-white/30 px-6 text-slate-900 backdrop-blur-sm">{countdown}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-white p-6 text-center">
                  <p className="text-lg font-bold text-slate-800">Upload images for {selectedLayout.name}</p>
                  <p className="mt-1 text-sm text-slate-600">Please select exactly {selectedLayout.poses} images.</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadFiles}
                    className="mt-4 w-full max-w-sm rounded-xl border-2 border-slate-300 p-2"
                  />
                  {uploadError && <p className="mt-3 text-sm font-semibold text-red-600">{uploadError}</p>}
                  {isUploading && <p className="mt-3 text-sm font-semibold text-slate-700">Uploading...</p>}
                </div>
              )}
            </div>

            {captureMode === "camera" && (
              <div className="mt-3 flex justify-center sm:justify-end">
                <Button
                  variant="primary"
                  className="px-6 py-2.5"
                  disabled={isCapturing}
                  onClick={() => {
                    if (captureComplete) {
                      setAppState("CUSTOMIZE");
                      return;
                    }
                    void startCapture();
                  }}
                >
                  {isCapturing
                    ? "Capturing..."
                    : captureComplete
                      ? "Continue"
                      : `Start Capture (${selectedLayout.poses} photos)`}
                </Button>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-3 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-800">Live Preview</h3>
            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              {livePreview ? (
                <img src={livePreview} alt="live strip preview" className="mx-auto max-h-36 rounded-lg object-contain" />
              ) : (
                <p className="text-sm text-slate-600">Capture at least 1 photo to preview your strip.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-800">Filters</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "primary" : "default"}
                  onClick={() => setFilter(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Shots</h3>
              <span className="text-sm font-semibold text-slate-600">{shotProgressText}</span>
            </div>
            <div className="grid max-h-24 grid-cols-4 gap-2 overflow-y-auto">
              {capturedPhotos.map((photo, idx) => (
                <img
                  key={`${photo}-${idx}`}
                  src={photo}
                  alt={`shot-${idx + 1}`}
                  className="aspect-square h-auto w-full rounded-lg border border-slate-200 object-cover"
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
