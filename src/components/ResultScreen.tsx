"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import { useBoothStore } from "@/store/useBoothStore";

export function ResultScreen() {
  const finalMergedImage = useBoothStore((state) => state.finalMergedImage);
  const setAppState = useBoothStore((state) => state.setAppState);
  const resetSession = useBoothStore((state) => state.resetSession);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const handleDownload = () => {
    if (!finalMergedImage) return;
    const link = document.createElement("a");
    link.href = finalMergedImage;
    link.download = `photoboot-${Date.now()}.png`;
    link.click();
  };

  const handleGenerateQr = async () => {
    if (!finalMergedImage) return;
    setQrLoading(true);
    setQrError(null);
    try {
      const upload = await fetch("/api/strip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: finalMergedImage }),
      });
      if (!upload.ok) {
        const err = await upload.json().catch(() => ({}));
        const message = typeof err?.error === "string" ? err.error : "Could not prepare link.";
        throw new Error(message);
      }
      const { id } = (await upload.json()) as { id?: string };
      if (!id) throw new Error("Invalid server response.");

      const downloadUrl = `${window.location.origin}/api/strip/${id}`;
      const qrData = await QRCode.toDataURL(downloadUrl, {
        width: 280,
        margin: 2,
        errorCorrectionLevel: "M",
      });
      setQrCodeImage(qrData);
      setQrError(null);
    } catch (e) {
      setQrCodeImage(null);
      setQrError(
        e instanceof Error ? e.message : "QR could not be created. Try regular download."
      );
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-12 text-center">
      <h2 className="text-4xl font-black text-slate-900">Your Final Strip</h2>
      <div className="mt-6 rounded-3xl border-2 border-slate-900 bg-white p-4 shadow-[6px_6px_0_0_#1e293b]">
        {finalMergedImage ? (
          <img src={finalMergedImage} alt="final strip" className="max-h-[70vh] rounded-xl" />
        ) : (
          <p>No image generated yet.</p>
        )}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={handleDownload}>
          Download Photo Strip
        </Button>
        <Button disabled={qrLoading || !finalMergedImage} onClick={() => void handleGenerateQr()}>
          {qrLoading ? "Preparing QR…" : "Download via QR Code"}
        </Button>
        <Button
          onClick={() => {
            resetSession();
            setAppState("LAYOUT_SELECT");
          }}
        >
          Take New Photos
        </Button>
      </div>
      {qrError && <p className="mt-4 text-sm font-semibold text-red-700">{qrError}</p>}
      {qrCodeImage && (
        <div className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0_0_#1e293b]">
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Scan with your phone to open the photo, then save it from the browser.
          </p>
          <img src={qrCodeImage} alt="download qr" className="mx-auto rounded-md" />
        </div>
      )}
    </section>
  );
}
