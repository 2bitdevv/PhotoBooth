"use client";

import { create } from "zustand";
import { getLayoutById, type LayoutConfig, type LayoutId } from "@/lib/layouts";

export type BoothAppState =
  | "WELCOME"
  | "LAYOUT_SELECT"
  | "CAPTURE"
  | "CUSTOMIZE"
  | "RESULT";

export type StickerPlacement = {
  id: string;
  stickerId: string;
  stickerSrc: string;
  x: number;
  y: number;
  size: number;
};

type BoothStore = {
  appState: BoothAppState;
  selectedLayout: LayoutConfig;
  capturedPhotos: string[];
  activeFilter: string;
  selectedFrameColor: string;
  addedStickers: StickerPlacement[];
  finalMergedImage: string | null;
  countdownSeconds: number;
  setAppState: (state: BoothAppState) => void;
  setLayout: (layoutId: LayoutId) => void;
  setFilter: (filterId: string) => void;
  setFrameColor: (color: string) => void;
  setCountdownSeconds: (seconds: number) => void;
  addCapturedPhoto: (photoDataUrl: string) => void;
  setCapturedPhotos: (photos: string[]) => void;
  removeLastPhoto: () => void;
  setStickers: (stickers: StickerPlacement[]) => void;
  setFinalMergedImage: (imageDataUrl: string | null) => void;
  resetSession: () => void;
};

const defaultLayout = getLayoutById("A");
const defaultFrameColor = "#ffffff";

export const useBoothStore = create<BoothStore>((set) => ({
  appState: "WELCOME",
  selectedLayout: defaultLayout,
  capturedPhotos: [],
  activeFilter: "none",
  selectedFrameColor: defaultFrameColor,
  addedStickers: [],
  finalMergedImage: null,
  countdownSeconds: 3,
  setAppState: (state) => set({ appState: state }),
  setLayout: (layoutId) => set({ selectedLayout: getLayoutById(layoutId), capturedPhotos: [] }),
  setFilter: (filterId) => set({ activeFilter: filterId }),
  setFrameColor: (color) => set({ selectedFrameColor: color }),
  setCountdownSeconds: (seconds) => set({ countdownSeconds: seconds }),
  addCapturedPhoto: (photoDataUrl) =>
    set((state) => ({ capturedPhotos: [...state.capturedPhotos, photoDataUrl] })),
  setCapturedPhotos: (photos) => set({ capturedPhotos: photos }),
  removeLastPhoto: () =>
    set((state) => ({ capturedPhotos: state.capturedPhotos.slice(0, state.capturedPhotos.length - 1) })),
  setStickers: (stickers) => set({ addedStickers: stickers }),
  setFinalMergedImage: (imageDataUrl) => set({ finalMergedImage: imageDataUrl }),
  resetSession: () =>
    set({
      appState: "WELCOME",
      selectedLayout: defaultLayout,
      capturedPhotos: [],
      activeFilter: "none",
      selectedFrameColor: defaultFrameColor,
      addedStickers: [],
      finalMergedImage: null,
      countdownSeconds: 3,
    }),
}));
