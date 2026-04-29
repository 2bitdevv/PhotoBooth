export type LayoutId = "A" | "B" | "C" | "D";

export type LayoutConfig = {
  id: LayoutId;
  name: string;
  poses: number;
  columns: number;
  rows: number;
  imageWidth: number;
  imageHeight: number;
  stripWidth: number;
  stripHeight: number;
  padding: number;
  gap: number;
};

export const LAYOUTS: LayoutConfig[] = [
  {
    id: "A",
    name: "Layout A",
    poses: 4,
    columns: 1,
    rows: 4,
    imageWidth: 440,
    imageHeight: 302.5,
    stripWidth: 480,
    stripHeight: 1375,
    padding: 20,
    gap: 15,
  },
  {
    id: "B",
    name: "Layout B",
    poses: 3,
    columns: 1,
    rows: 3,
    imageWidth: 440,
    imageHeight: 303.33,
    stripWidth: 480,
    stripHeight: 1060,
    padding: 20,
    gap: 15,
  },
  {
    id: "C",
    name: "Layout C",
    poses: 2,
    columns: 1,
    rows: 2,
    imageWidth: 440,
    imageHeight: 305,
    stripWidth: 480,
    stripHeight: 745,
    padding: 20,
    gap: 15,
  },
  {
    id: "D",
    name: "Layout D",
    poses: 6,
    columns: 2,
    rows: 3,
    imageWidth: 420.5,
    imageHeight: 304,
    stripWidth: 895,
    stripHeight: 1060,
    padding: 20,
    gap: 14,
  },
];

export function getLayoutById(id: LayoutId): LayoutConfig {
  return LAYOUTS.find((layout) => layout.id === id) ?? LAYOUTS[0];
}
