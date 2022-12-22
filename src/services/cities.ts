import type { Action, Activity, City, Player, Type } from "@/services/types";

const ACTIVITY_MOTIVATION_MOVE = 30;
const ACTIVITY_POINTS_MOVE = 150;

export const ACTION_MOTIVATION_MOVE = 5;
export const ACTION_POINTS_MOVE = 20;

const CYCLE_MOTIVATION_COST = 15;

export const costDescription: (a: Activity, p: Player) => string = (a, p) => {
  switch (a.type) {
    case "points":
      return `++ points`;
    case "motivation":
      return `++ motivation`;
    case "cycle": {
      const { motivation, points } = cycleCost(p);
      return `-${points} points, -${motivation} motivation`;
    }
  }
};

export const cycleCost: (p: Player) => {
  motivation: number;
  points: number;
} = (p) => {
  return {
    points: getCyclePointsCost(p),
    motivation: CYCLE_MOTIVATION_COST,
  };
};

export const runActionOnPlayer: (a: Action, p: Player) => void = (a, p) => {
  const factor = a.effect === "decrease" ? -1 : 1;
  switch (a.type) {
    case "points":
      p.points += ACTION_POINTS_MOVE * factor;
      break;
    case "motivation":
      p.motivation += ACTION_MOTIVATION_MOVE * factor;
      break;
  }
};

export const runActivityOnPlayer: (a: Activity, p: Player) => void = (a, p) => {
  if (a.type === "cycle") {
    cycleToNextCity(p);
    return;
  }

  const variation = getVariation(a.type);

  switch (a.type) {
    case "points":
      p.points += ACTIVITY_POINTS_MOVE;
      p.points += variation;
      break;
    case "motivation":
      p.motivation += ACTIVITY_MOTIVATION_MOVE;
      p.motivation += variation;
      break;
  }
};

const getVariation: (type: Type) => number = (type) => {
  const max = type === "points" ? 30 : 7;
  const baseVariation = Math.round(Math.random() * max);
  if (Math.random() > 0.5) {
    return baseVariation * -1;
  }
  return baseVariation;
};

const cycleToNextCity: (p: Player) => void = (p) => {
  p.currentCity = getNextCity(p.currentCity);
  p.points -= getCyclePointsCost(p);
  p.motivation -= CYCLE_MOTIVATION_COST;
};

const getCyclePointsCost: (p: Player) => number = (p) => {
  if (p.motivation >= 95) return 90;
  if (p.motivation >= 90) return 100; //  10
  if (p.motivation >= 80) return 110; //  10 // 0
  if (p.motivation >= 70) return 120; //  10 // 0
  if (p.motivation >= 60) return 135; //  15 // 5
  if (p.motivation >= 50) return 160; //  25 // 10
  if (p.motivation >= 40) return 195; //  35 // 10
  if (p.motivation >= 30) return 245; //  50 // 15
  if (p.motivation >= 20) return 310; //  65 // 15
  if (p.motivation >= 10) return 395; //  85 // 20
  else return 500; // 105 // 20
};

const genericActions: Action[] = [
  {
    type: "motivation",
    effect: "increase",
    text: "What a nice weather today! You can't wait to get on.",
  },
  {
    type: "motivation",
    effect: "decrease",
    text: "Uuuuh this rain. If you only you had stayed at home and not started this adventure!",
  },
  {
    type: "points",
    effect: "decrease",
    text: "You have a flat tire. You need to repair it.",
  },
  {
    type: "points",
    effect: "decrease",
    text: "You got stopped by the police, because you were cycling without light. You get fined.",
  },
  {
    type: "points",
    effect: "decrease",
    text: "You met a very talkative stranger. This is was not helpful in getting to Wageningen quickly.",
  },
];

const genericActivities: Activity[] = [
  {
    type: "points",
    name: "Take a nap",
    text: () => "You really needed this. Now you're ready to cycle on.",
  },
  {
    type: "motivation",
    name: "Have your bike cleaned",
    text: () => "Your bike is all shiny again.",
  },
  {
    name: "Cycle to the next city",
    type: "cycle",
    text: () => "",
  },
];

export const cities: City[] = [
  {
    name: "Zurich",
    actions: [
      {
        type: "motivation",
        effect: "decrease",
        text: "You had a coffee in the city center. When you paid for it, you realised how expensive coffees are in Zurich.",
      },
      {
        type: "points",
        effect: "decrease",
        text: "Laurie convinced you to row with her. You forgot that the goal of this game is to cycle.",
      },
    ],
    activities: [
      {
        type: "motivation",
        name: "Visit Laurie & Reto",
        text: () =>
          "You had some fondue with white wine. You feel very full, but you're ready for your adventure.",
      },
      {
        type: "points",
        name: "Cycle up the Uetliberg",
        text: () =>
          "Once you're on the top and you can enjoy the view over the city and lake, you know why you love cycling so much.",
      },
    ],
  },
  {
    name: "Basel",
    actions: [
      {
        type: "motivation",
        effect: "increase",
        text: "On this beautiful day, you're cooling off in the Rhine.",
      },
    ],
    activities: [
      {
        type: "points",
        name: "Party at the Carnival of Basel",
        text: () =>
          "You had a great time partying with the people of Basel. You're all recovered!",
      },
      {
        name: "Talk to a stranger",
        type: "motivation",
        text: () =>
          "You're lucky! The stranger explained to you how beautiful the route to Wageningen is.",
      },
    ],
  },
  {
    name: "Köln",
    actions: [
      {
        type: "motivation",
        effect: "decrease",
        text: "You're annoyed how ill-equipped Köln is for cycling.",
      },
    ],
    activities: [
      {
        name: "Visit the Cologne Cathedral",
        type: "points",
        text: () =>
          "You climb all the way up to the south tower of the Cathedral. What a view!",
      },
    ],
  },
  {
    name: "Duisburg",
    actions: [
      {
        type: "points",
        effect: "decrease",
        text: "You wanted to relax in the Landschaftspark, but it turns out the park is not quite what you expected.",
      },
    ],
    activities: [
      {
        name: "Cycle on the Magic Mountain",
        type: "motivation",
        text: () =>
          "Well.. turns out this sculpture is not suited for cycling, but there were many tourists cheering you on anyway.",
      },
    ],
  },
  {
    name: "Arnhem",
    actions: [
      {
        type: "points",
        effect: "increase",
        text: "You step off your bike in the Sonsbeek park",
      },
      {
        type: "points",
        effect: "decrease",
        text: "You did a detour to Doetinchem.",
      },
    ],
    activities: [
      {
        name: "Visit Milou",
        type: "motivation",
        text: () => {
          const tips = [
            "Milou tells you a secret shortcut how to cycle faster to Wageningen.",
            "Milou pumps your bikes tires.",
            "Milou explains to you why cycling is the best sport.",
          ];
          return `${
            tips[Math.floor(Math.random() * tips.length)]
          } You points increase by ${ACTIVITY_MOTIVATION_MOVE}.`;
        },
      },
    ],
  },
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
