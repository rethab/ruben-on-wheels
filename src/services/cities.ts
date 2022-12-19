import type { Action, Activity, City, Player } from "@/services/types";

const ACTIVITY_MOTIVATION_MOVE = 30;
const ACTIVITY_POINTS_MOVE = 150;

const ACTION_MOTIVATION_MOVE = 5;
const ACTION_POINTS_MOVE = 20;

const cycleToNextCity: (p: Player) => void = (p) => {
  p.currentCity = getNextCity(p.currentCity);

  const pointsCost =
    p.motivation >= 75
      ? 100
      : p.motivation >= 50
      ? 125
      : p.motivation >= 25
      ? 150
      : 200;
  p.points -= pointsCost;
  p.motivation -= 15;
};

const genericActions: Action[] = [
  {
    run: (p: Player) => {
      p.motivation += ACTION_MOTIVATION_MOVE;
      return "What a nice weather today! Your motivation increases by 5 and you can't wait to get on.";
    },
  },
  {
    run: (p: Player) => {
      p.motivation -= ACTION_MOTIVATION_MOVE;
      return "Uuuuh this rain. If you only you had stayed at home and not started this adventure! Your motivation drops by 5.";
    },
  },
  {
    run: (p: Player) => {
      p.points -= ACTION_POINTS_MOVE;
      return "You have a flat tire. Repairing it costs you 20 points.";
    },
  },
  {
    run: (p: Player) => {
      p.points -= ACTION_POINTS_MOVE;
      return "You got stopped by the police, because you were cycling without light. The fine costs you 20 points.";
    },
  },
];

const genericActivities: Activity[] = [
  {
    name: "Take a nap",
    run: (p: Player) => {
      p.points += ACTIVITY_POINTS_MOVE;
      return "They say napping is good for you, but you can't be sure until you've done it! That's 150 points for you.";
    },
  },
  {
    name: "Cycle to the next city",
    run: (p: Player) => {
      const pointsBefore = p.points;
      const motivationBefore = p.motivation;
      cycleToNextCity(p);
      const pointsCost = pointsBefore - p.points;
      const motivationCost = motivationBefore - p.motivation;

      return `Well done, you have cycled to ${p.currentCity}. Your points have dropped by ${pointsCost} and the motivation by ${motivationCost}.`;
    },
  },
];

export const cities: City[] = [
  {
    name: "Zurich",
    actions: [
      {
        run: (p: Player) => {
          p.motivation -= ACTION_MOTIVATION_MOVE;
          return "You had a coffee in the city center. When you paid for it, you realised how expensive coffees are in Zurich. Your motivation drops by 5 points.";
        },
      },
    ],
    activities: [
      {
        name: "Visit Laurie & Reto",
        run: (p: Player) => {
          p.motivation += ACTIVITY_MOTIVATION_MOVE;
          return "You had some fondue with white wine. You feel very full, but you're ready for your adventure. Your motivation increases by 5 points.";
        },
      },
    ],
  },
  {
    name: "Basel",
    actions: [],
    activities: [
      {
        name: "Party at the Carnival of Basel",
        run: (p: Player) => {
          p.points -= ACTIVITY_POINTS_MOVE;
          return "You had a great time partying with the people of Basel, but your bike got stolen. Replacing it costs you 20 points.";
        },
      },
    ],
  },
  { name: "Köln", actions: [], activities: [] },
  { name: "Duisburg", actions: [], activities: [] },
  { name: "Arnhem", actions: [], activities: [] },
  { name: "Wageningen", actions: [], activities: [] },
];

export const getCityAction: (cityName: string) => Action = (cityName) => {
  const city = getCityByName(cityName);
  const actions = [...city.actions, ...genericActions];
  return actions[Math.floor(Math.random() * actions.length)];
};

export const getCityActivities: (cityName: string) => Activity[] = (
  cityName
) => {
  const city = getCityByName(cityName);
  return [...city.activities, ...genericActivities];
};

export const getCityByName: (cityName: string) => City = (cityName) => {
  return cities.find(({ name }) => name === cityName)!;
};

export const getNextCity: (cityName: string) => string = (cityName) => {
  const index = cities.findIndex(({ name }) => name === cityName);
  return cities[index + 1].name;
};
