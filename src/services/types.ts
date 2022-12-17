export interface Player {
  name: string;
  points: number;
  motivation: number;
  currentCity: string;
}

export interface Action {
  run: (p: Player) => string;
}

export interface Activity {
  name: string;
  run: (p: Player) => string;
}

export interface City {
  name: string;
  actions: Action[];
  activities: Activity[];
}
