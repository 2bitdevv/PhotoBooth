"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import { useBoothStore } from "@/store/useBoothStore";

const REVIEW_SUBMITTED_KEY = "photoboot.review.submitted";

export function ResultScreen() {
  const finalMergedImage = useBoothStore((state) => state.finalMergedImage);
  const setAppState = useBoothStore((state) => state.setAppState);
  const resetSession = useBoothStore((state) => state.resetSession);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasSubmittedReview(window.localStorage.getItem(REVIEW_SUBMITTED_KEY) === "1");
  }, []);

  const handleDownload = () => {
    if (!finalMergedImage) return;
    const link = document.createElement("a");
    link.href = finalMergedImage;
    link.download = `photoboot-${Date.now()}.png`;
    link.click();
    if (!hasSubmittedReview) {
      setShowReviewForm(true);
    }
  };

  const handleSubmitReview = async () => {
    if (rating < 1 || reviewLoading) return;
    setReviewLoading(true);
    setReviewStatus({ type: "idle", message: "" });
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: reviewComment }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not submit review.");
      }
      setReviewStatus({ type: "success", message: "Thank you for your review!" });
      if (typeof window !== "undefined") {
        window.localStorage.setItem(REVIEW_SUBMITTED_KEY, "1");
      }
      setHasSubmittedReview(true);
      setReviewComment("");
      setTimeout(() => {
        setShowReviewForm(false);
      }, 700);
    } catch (error) {
      setReviewStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not submit review.",
      });
    } finally {
      setReviewLoading(false);
    }
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
      const data = (await upload.json()) as { url?: string };
      const downloadUrl = typeof data.url === "string" ? data.url : null;
      if (!downloadUrl) throw new Error("Invalid server response.");
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
      {showReviewForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-3 py-3 backdrop-blur-[2px] sm:items-center sm:px-4 sm:py-6"
          onClick={() => setShowReviewForm(false)}
        >
          <div
            className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-3xl border-2 border-slate-900 bg-white p-4 text-left shadow-[6px_6px_0_0_#1e293b] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Rate your experience</p>
                <h3 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">How was your PhotoBoot?</h3>
                <p className="mt-1 text-sm text-slate-600">Quick feedback helps us improve your next strip.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                aria-label="Close review popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => {
                const active = (hoveredRating || rating) >= value;
                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(value)}
                    className="rounded-full p-1 transition hover:scale-105"
                    aria-label={`rate ${value} stars`}
                  >
                    <Star
                      className={`h-7 w-7 sm:h-8 sm:w-8 ${active ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-300"}`}
                    />
                  </button>
                );
              })}
              <span className="text-sm font-semibold text-slate-600 sm:ml-2">{rating > 0 ? `${rating}/5` : "Tap to rate"}</span>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Comment (optional)</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Tell us what you liked or what we should improve..."
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" disabled={rating < 1 || reviewLoading} onClick={() => void handleSubmitReview()}>
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </Button>
              <Button onClick={() => setShowReviewForm(false)}>Skip</Button>
            </div>

            {reviewStatus.type !== "idle" && (
              <p className={`mt-3 text-sm font-semibold ${reviewStatus.type === "success" ? "text-green-700" : "text-red-700"}`}>
                {reviewStatus.message}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
