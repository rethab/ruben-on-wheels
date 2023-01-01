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

  async runActionOnPlayer(a: Action, p: Player) {
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
    await this.store.updatePlayer(p, p.currentCity, newPoints, newMotivation);
  }

  async runActivityOnPlayer(a: Activity, p: Player) {
    if (a.type === "cycle") {
      await this.cycleToNextCity(p);
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

    await this.store.updatePlayer(p, p.currentCity, newPoints, newMotivation);
  }

  getVariation(type: Type) {
    const max = type === "points" ? 30 : 7;
    const baseVariation = Math.round(Math.random() * max);
    if (Math.random() > 0.5) {
      return baseVariation * -1;
    }
    return baseVariation;
  }

  private async cycleToNextCity(p: Player) {
    const newCity = getNextCity(p.currentCity);
    const newPoints = p.points - getCyclePointsCost(p);
    const newMotivation = p.motivation - CYCLE_MOTIVATION_COST;

    await this.store.updatePlayer(p, newCity, newPoints, newMotivation);
  }
}
