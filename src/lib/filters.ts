export type FilterOption = {
  id: string;
  label: string;
  css: string;
};

export const FILTERS: FilterOption[] = [
  { id: "none", label: "No Filter", css: "none" },
  { id: "bw", label: "B&W", css: "grayscale(1)" },
  { id: "sepia", label: "Sepia", css: "sepia(0.75)" },
  { id: "vintage", label: "Vintage", css: "sepia(0.35) contrast(1.05) saturate(0.9)" },
  { id: "soft", label: "Soft", css: "brightness(1.05) contrast(0.9) saturate(1.1)" },
  { id: "noir", label: "Noir", css: "grayscale(1) contrast(1.2)" },
];

export function getFilterCss(id: string): string {
  return FILTERS.find((filter) => filter.id === id)?.css ?? "none";
}
