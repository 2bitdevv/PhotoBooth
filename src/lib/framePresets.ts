import type { StickerAssetId } from "@/lib/stickerAssets";
export type PhotoShape = "rounded" | "circle" | "heart";

export type FramePreset = {
  id: string;
  name: string;
  accent: string;
  panelBg: string;
  frameColor: string;
  photoBorderColor: string;
  photoShape: PhotoShape;
  stickers: StickerAssetId[];
};

export const FRAME_PRESETS: FramePreset[] = [
  {
    id: "sweet-heart",
    name: "Sweet Heart",
    accent: "#ec4899",
    panelBg: "#ffe4ef",
    frameColor: "#fde2ef",
    photoBorderColor: "#f472b6",
    photoShape: "heart",
    stickers: ["heartSparkle", "pinkBow", "teddyFace", "sparkleCluster"],
  },
  {
    id: "sky-bubble",
    name: "Sky Bubble",
    accent: "#38bdf8",
    panelBg: "#e0f2fe",
    frameColor: "#dbeafe",
    photoBorderColor: "#60a5fa",
    photoShape: "circle",
    stickers: ["cloudBlue", "bubble", "butterfly", "starGlass"],
  },
  {
    id: "pink-spark",
    name: "Pink Spark",
    accent: "#fb7185",
    panelBg: "#ffe4e6",
    frameColor: "#ffe4ea",
    photoBorderColor: "#f43f5e",
    photoShape: "rounded",
    stickers: ["sparkleCluster", "heartOutline", "flowerPink", "rainbow"],
  },
  {
    id: "peach-bloom",
    name: "Peach Bloom",
    accent: "#fb923c",
    panelBg: "#ffedd5",
    frameColor: "#ffedd5",
    photoBorderColor: "#fdba74",
    photoShape: "rounded",
    stickers: ["flowerPink", "sakura", "sparkleCluster", "heartOutline"],
  },
  {
    id: "mint-glow",
    name: "Mint Glow",
    accent: "#14b8a6",
    panelBg: "#ccfbf1",
    frameColor: "#d1fae5",
    photoBorderColor: "#2dd4bf",
    photoShape: "circle",
    stickers: ["bubble", "cloudBlue", "starGlass", "sparkleCluster"],
  },
  {
    id: "lilac-dream",
    name: "Lilac Dream",
    accent: "#8b5cf6",
    panelBg: "#ede9fe",
    frameColor: "#ede9fe",
    photoBorderColor: "#a78bfa",
    photoShape: "heart",
    stickers: ["heartOutline", "butterfly", "sparkleCluster", "flowerPink"],
  },
  {
    id: "cherry-pop",
    name: "Cherry Pop",
    accent: "#f43f5e",
    panelBg: "#ffe4e6",
    frameColor: "#fff1f2",
    photoBorderColor: "#fb7185",
    photoShape: "rounded",
    stickers: ["ribbonRed", "heartSparkle", "sakura", "pinkBow"],
  },
  {
    id: "ocean-stars",
    name: "Ocean Stars",
    accent: "#0ea5e9",
    panelBg: "#dbeafe",
    frameColor: "#e0f2fe",
    photoBorderColor: "#38bdf8",
    photoShape: "circle",
    stickers: ["starGlass", "bubble", "cloudBlue", "butterfly"],
  },
  {
    id: "monochrome-chic",
    name: "Monochrome Chic",
    accent: "#334155",
    panelBg: "#e2e8f0",
    frameColor: "#f1f5f9",
    photoBorderColor: "#64748b",
    photoShape: "rounded",
    stickers: ["heartOutline", "sparkleCluster", "ribbonRed", "starGlass"],
  },
  {
    id: "sunset-cloud",
    name: "Sunset Cloud",
    accent: "#f97316",
    panelBg: "#ffedd5",
    frameColor: "#fef3c7",
    photoBorderColor: "#fb923c",
    photoShape: "heart",
    stickers: ["rainbow", "cloudBlue", "sparkleCluster", "heartSparkle"],
  },
];

export function getFramePresetById(id: FramePreset["id"]): FramePreset {
  return FRAME_PRESETS.find((preset) => preset.id === id) ?? FRAME_PRESETS[0];
}
