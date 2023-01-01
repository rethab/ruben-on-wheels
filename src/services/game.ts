import {
  ACTION_MOTIVATION_MOVE,
  ACTION_POINTS_MOVE,
  ACTIVITY_MOTIVATION_MOVE,
  ACTIVITY_POINTS_MOVE,
  CYCLE_MOTIVATION_COST,
  getCyclePointsCost,
  getNextCity,
} from "@/services/cities";
import type { Action, Activity, Player, Type } from "@/services/types";

interface Store {
  updatePlayer(
    p: Player,
    city: string,
    points: number,
    motivation: number
  ): void;
}

export class GameService {
  constructor(private store: Store) {}

  runActionOnPlayer: (a: Action, p: Player) => void = (a, p) => {
    const factor = a.effect === "decrease" ? -1 : 1;
    let newPoints = p.points;
    let newMotivation = p.motivation;
    switch (a.type) {
      case "points":
        newPoints += ACTION_POINTS_MOVE * factor;
        break;
      case "motivation":
        newMotivation += ACTION_MOTIVATION_MOVE * factor;
        break;
    }
    this.store.updatePlayer(p, p.currentCity, newPoints, newMotivation);
  };

  runActivityOnPlayer: (a: Activity, p: Player) => void = (a, p) => {
    if (a.type === "cycle") {
      this.cycleToNextCity(p);
      return;
    }

    const variation = this.getVariation(a.type);

    let newPoints = p.points;
    let newMotivation = p.motivation;
    switch (a.type) {
      case "points":
        newPoints += ACTIVITY_POINTS_MOVE;
        newPoints += variation;
        break;
      case "motivation":
        newMotivation += ACTIVITY_MOTIVATION_MOVE;
        newMotivation += variation;
        break;
    }

    this.store.updatePlayer(p, p.currentCity, newPoints, newMotivation);
  };

  getVariation: (type: Type) => number = (type) => {
    const max = type === "points" ? 30 : 7;
    const baseVariation = Math.round(Math.random() * max);
    if (Math.random() > 0.5) {
      return baseVariation * -1;
    }
    return baseVariation;
  };

  cycleToNextCity: (p: Player) => void = (p) => {
    const newCity = getNextCity(p.currentCity);
    const newPoints = p.points - getCyclePointsCost(p);
    const newMotivation = p.motivation - CYCLE_MOTIVATION_COST;

    this.store.updatePlayer(p, newCity, newPoints, newMotivation);
  };
}
