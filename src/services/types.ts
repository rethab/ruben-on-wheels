export interface Player {
  name: string;
  points: number;
  motivation: number;
  currentCity: string;
}

export interface Action {
  type: "motivation" | "points";
  effect: "increase" | "decrease";
  text: string;
}

export interface Activity {
  name: string;
  type: "motivation" | "points" | "cycle";
  run: (p: Player) => string;
}

export interface City {
  name: string;
  actions: Action[];
  activities: Activity[];
}
