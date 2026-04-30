import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { LAYOUTS } from "@/lib/layouts";
import { cn } from "@/lib/classnames";
import { useBoothStore } from "@/store/useBoothStore";

const previewImageByPoses: Record<number, string> = {
  2: "/1-2.png",
  3: "/1-3.png",
  4: "/1-4.png",
  6: "/1-6.png",
};

const previewSizeByPoses: Record<number, string> = {
  2: "max-h-44",
  3: "max-h-56",
  4: "max-h-72",
  6: "max-h-72",
};

function LayoutPreviewImage({
  poses,
  isSelected,
}: {
  poses: number;
  isSelected: boolean;
}) {
  const [isBroken, setIsBroken] = useState(false);
  const src = previewImageByPoses[poses];
  const sizeClass = previewSizeByPoses[poses] ?? "max-h-56";

  if (!src || isBroken) {
    return <div className={cn("w-full rounded-xl bg-slate-100", sizeClass)} />;
  }

  return (
    <img
      src={src}
      alt={`${poses} poses preview`}
      className={cn(
        "h-auto w-full rounded-xl border object-contain transition",
        sizeClass,
        isSelected ? "border-blue-500" : "border-slate-200"
      )}
      onError={() => setIsBroken(true)}
    />
  );
}

export function LayoutSelector() {
  const selectedLayout = useBoothStore((state) => state.selectedLayout);
  const setLayout = useBoothStore((state) => state.setLayout);
  const setAppState = useBoothStore((state) => state.setAppState);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    const sources = Object.values(previewImageByPoses);
    let active = true;
    void Promise.all(
      sources.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = src;
          })
      )
    ).then(() => {
      if (active) setImagesReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 text-center">
      <h2 className="text-4xl font-black text-slate-800 sm:text-5xl">Choose your layout</h2>
      <p className="mt-2 text-slate-600">Select a layout for your photo session. You can choose from different styles and poses.</p>
      <div className="mx-auto mt-8 max-w-5xl rounded-3xl bg-linear-to-b from-blue-100 to-white px-3 py-5 sm:px-6 sm:py-6">
        <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => setLayout(layout.id)}
            className={cn(
              "mx-auto w-full max-w-[170px] rounded-xl border bg-white p-2 text-left shadow-md transition",
              selectedLayout.id === layout.id ? "border-blue-500" : "border-slate-200 hover:border-blue-300"
            )}
          >
            {imagesReady ? (
              <LayoutPreviewImage
                poses={layout.poses}
                isSelected={selectedLayout.id === layout.id}
              />
            ) : (
              <div className="h-44 w-full animate-pulse rounded-xl bg-slate-100" />
            )}
            <p className="mt-2 text-sm font-bold text-slate-900 sm:text-base">{layout.name}</p>
            <p className="text-xs text-slate-600">{layout.poses} Pose</p>
          </button>
        ))}
        </div>
      </div>
      <Button variant="primary" className="mt-10 px-8 py-3 text-lg" onClick={() => setAppState("CAPTURE")}>
        Continue
      </Button>
    </section>
  );
}
