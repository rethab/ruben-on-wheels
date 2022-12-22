export interface Player {
  name: string;
  points: number;
  motivation: number;
  currentCity: string;
}

export type Type = "motivation" | "points";

export interface Action {
  type: Type;
  effect: "increase" | "decrease";
  text: string;
}

export interface Activity {
  name: string;
  type: "motivation" | "points" | "cycle";
  text: () => string;
}

export interface City {
  name: string;
  actions: Action[];
  activities: Activity[];
}
