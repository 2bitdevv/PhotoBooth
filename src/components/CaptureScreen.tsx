"use client";

import { useCallback, useMemo, useRef, useState, type ChangeEvent } from "react";
import Webcam from "react-webcam";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FILTERS, getFilterCss } from "@/lib/filters";
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

  const filterCss = useMemo(() => getFilterCss(activeFilter), [activeFilter]);

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
    setAppState("CUSTOMIZE");
  }, [
    addCapturedPhoto,
    capturedPhotos.length,
    countdownSeconds,
    isCapturing,
    selectedLayout.poses,
    setAppState,
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
        setAppState("CUSTOMIZE");
      } catch {
        setUploadError("Some images could not be read. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [selectedLayout.poses, setAppState, setCapturedPhotos]
  );

  return (
    <section className="mx-auto mt-3 grid max-w-6xl grid-cols-1 gap-8 px-4 pb-10 lg:grid-cols-[2fr_1fr]">
      <div>
        <div className="mb-4 flex gap-2">
          <Button variant={captureMode === "camera" ? "primary" : "default"} onClick={() => setCaptureMode("camera")}>
            Camera
          </Button>
          <Button variant={captureMode === "upload" ? "primary" : "default"} onClick={() => setCaptureMode("upload")}>
            Upload Images
          </Button>
        </div>

        <div className="photo-container">
          <div className="camera-container relative h-[260px] w-full overflow-hidden rounded-3xl border-2 border-slate-900 bg-black shadow-[6px_6px_0_0_#1e293b] sm:h-[360px] md:h-[420px]">
            {captureMode === "camera" ? (
              <>
                <Webcam
                  ref={webcamRef}
                  mirrored
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.95}
                  forceScreenshotSourceSize
                  videoConstraints={videoConstraints}
                  className="video-feed h-full w-full"
                  style={{ filter: filterCss, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <AnimatePresence>
                  {countdown !== null && (
                    <motion.div
                      key={countdown}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.4, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center text-8xl font-black text-white"
                    >
                      <span className="rounded-3xl bg-white/30 px-6 text-slate-900 backdrop-blur-sm">{countdown}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="flex h-[260px] flex-col items-center justify-center bg-white p-6 text-center sm:h-[360px] md:h-[420px]">
                <p className="text-lg font-bold text-slate-800">Upload images for {selectedLayout.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Please select exactly {selectedLayout.poses} images.
                </p>
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
        </div>
        {captureMode === "camera" && (
          <>
            <div className="mt-4 flex items-center gap-3">
              <label htmlFor="timer" className="font-semibold text-slate-700">
                Countdown Time:
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
            <Button variant="primary" className="mt-4 px-8 py-3" disabled={isCapturing} onClick={startCapture}>
              {isCapturing ? "Capturing..." : `Start Capture (${selectedLayout.poses} photos)`}
            </Button>
          </>
        )}
      </div>
      <aside>
        <h3 className="text-lg font-bold text-slate-800">Filters</h3>
        <div className="mt-3 flex flex-wrap gap-2">
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
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800">Shots</h3>
          <p className="text-slate-700">
            {capturedPhotos.length} / {selectedLayout.poses}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {capturedPhotos.map((photo, idx) => (
              <img
                key={`${photo}-${idx}`}
                src={photo}
                alt={`shot-${idx + 1}`}
                className="aspect-video h-auto w-full rounded-xl border-2 border-slate-700 object-cover"
              />
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
