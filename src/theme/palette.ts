import { HabitColor, HabitColorId } from "../types";

export const HABIT_COLORS: HabitColor[] = [
  { id: "sage", label: "Sage", primary: "#7a9e7e" },
  { id: "teal", label: "Teal", primary: "#5b9ea6" },
  { id: "sky", label: "Sky", primary: "#6b9fd4" },
  { id: "lavender", label: "Lavender", primary: "#9585c1" },
  { id: "coral", label: "Coral", primary: "#d47b6b" },
  { id: "amber", label: "Amber", primary: "#c99a4a" },
  { id: "rose", label: "Rose", primary: "#c46b8a" },
  { id: "slate", label: "Slate", primary: "#7a8a9e" },
];

export function getHabitColor(id: HabitColorId): HabitColor {
  return HABIT_COLORS.find((c) => c.id === id) ?? HABIT_COLORS[0];
}
