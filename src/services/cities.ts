import type { Action, Activity, City, Player } from "@/services/types";

const ACTIVITY_MOTIVATION_MOVE = 30;
const ACTIVITY_POINTS_MOVE = 150;

const ACTION_MOTIVATION_MOVE = 5;
const ACTION_POINTS_MOVE = 20;

const CYCLE_MOTIVATION_COST = 15;

export const costDescription: (a: Activity, p: Player) => string = (a, p) => {
  switch (a.type) {
    case "points":
      return `+${ACTIVITY_POINTS_MOVE} points`;
    case "motivation":
      return `+${ACTIVITY_MOTIVATION_MOVE} motivation`;
    case "cycle":
      return `-${getCyclePointsCost(
        p
      )} points, -${CYCLE_MOTIVATION_COST} motivation`;
  }
};

const cycleToNextCity: (p: Player) => void = (p) => {
  p.currentCity = getNextCity(p.currentCity);
  p.points -= getCyclePointsCost(p);
  p.motivation -= CYCLE_MOTIVATION_COST;
};

const getCyclePointsCost: (p: Player) => number = (p) => {
  return p.motivation >= 75
    ? 100
    : p.motivation >= 50
    ? 125
    : p.motivation >= 25
    ? 150
    : 200;
};

const genericActions: Action[] = [
  {
    run: (p: Player) => {
      p.motivation += ACTION_MOTIVATION_MOVE;
      return `What a nice weather today! Your motivation increases by ${ACTION_MOTIVATION_MOVE} and you can't wait to get on.`;
    },
  },
  {
    run: (p: Player) => {
      p.motivation -= ACTION_MOTIVATION_MOVE;
      return `Uuuuh this rain. If you only you had stayed at home and not started this adventure! Your motivation drops by ${ACTION_MOTIVATION_MOVE}.`;
    },
  },
  {
    run: (p: Player) => {
      p.points -= ACTION_POINTS_MOVE;
      return `You have a flat tire. Repairing it costs you ${ACTION_POINTS_MOVE} points.`;
    },
  },
  {
    run: (p: Player) => {
      p.points -= ACTION_POINTS_MOVE;
      return `You got stopped by the police, because you were cycling without light. The fine costs you ${ACTION_POINTS_MOVE} points.`;
    },
  },
  {
    run: (p: Player) => {
      p.points -= ACTION_POINTS_MOVE;
      return `You met a very talkative stranger. This is was not helpful in getting to Wageningen quickly.. You've lost ${ACTION_POINTS_MOVE}.`;
    },
  },
];

const genericActivities: Activity[] = [
  {
    type: "points",
    name: "Take a nap",
    run: (p: Player) => {
      p.points += ACTIVITY_POINTS_MOVE;
      return `They say napping is good for you, but you can't be sure until you've done it! That's ${ACTIVITY_POINTS_MOVE} points for you.`;
    },
  },
  {
    type: "motivation",
    name: "Have your bike cleaned",
    run: (p: Player) => {
      p.motivation += ACTIVITY_MOTIVATION_MOVE;
      return `Your bike is all shiny again. You're not sure if this helps how fast you can cycle, but you're motivation is up ${ACTIVITY_MOTIVATION_MOVE}.`;
    },
  },
  {
    name: "Cycle to the next city",
    type: "cycle",
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
          return `You had a coffee in the city center. When you paid for it, you realised how expensive coffees are in Zurich. Your motivation drops by ${ACTION_MOTIVATION_MOVE} points.`;
        },
      },
      {
        run: (p: Player) => {
          p.points -= ACTION_POINTS_MOVE;
          return `Laurie convinced you to row with her. You forgot that the goal of this game is to cycle. You loose ${ACTION_POINTS_MOVE} points.`;
        },
      },
    ],
    activities: [
      {
        type: "motivation",
        name: "Visit Laurie & Reto",
        run: (p: Player) => {
          p.motivation += ACTIVITY_MOTIVATION_MOVE;
          return `You had some fondue with white wine. You feel very full, but you're ready for your adventure. Your motivation increases by ${ACTION_MOTIVATION_MOVE} points.`;
        },
      },
      {
        type: "points",
        name: "Cycle up the Uetliberg",
        run: (p: Player) => {
          p.points += ACTIVITY_POINTS_MOVE;
          return `Once you're on the top and you can enjoy the view over the city and lake, you know why you love cycling so much. Your points increase by ${ACTIVITY_POINTS_MOVE}.`;
        },
      },
    ],
  },
  {
    name: "Basel",
    actions: [
      {
        run: (p: Player) => {
          p.motivation += ACTION_MOTIVATION_MOVE;
          return `On this beautiful day, you're cooling off in the Rhine. Your motivation is up by ${ACTION_MOTIVATION_MOVE}.`;
        },
      },
    ],
    activities: [
      {
        type: "points",
        name: "Party at the Carnival of Basel",
        run: (p: Player) => {
          p.points += ACTIVITY_POINTS_MOVE;
          return "You had a great time partying with the people of Basel. You're all recovered!";
        },
      },
      {
        name: "Tal to a stranger",
        type: "motivation",
        run: (p: Player) => {
          p.motivation += ACTIVITY_MOTIVATION_MOVE;
          return `You're lucky! The stranger explained to you how beautiful the route to Wageningen is. Your motivation increases by ${ACTIVITY_MOTIVATION_MOVE}.`;
        },
      },
    ],
  },
  {
    name: "Köln",
    actions: [
      {
        run: (p: Player) => {
          p.motivation -= ACTION_MOTIVATION_MOVE;
          return `You're annoyed how ill-equipped Köln is for cycling. Your motivation drops by ${ACTION_MOTIVATION_MOVE}.`;
        },
      },
    ],
    activities: [
      {
        name: "Visit the Cologne Cathedral",
        type: "points",
        run: (p: Player) => {
          p.points += ACTIVITY_POINTS_MOVE;
          return `You climb all the way up to the south tower of the Cathedral. What a view! Your points increase by ${ACTIVITY_POINTS_MOVE}.`;
        },
      },
    ],
  },
  {
    name: "Duisburg",
    actions: [
      {
        run: (p: Player) => {
          p.points -= ACTION_POINTS_MOVE;
          return `You wanted to relax in the Landschaftspark, but it turns out the park is not quite what you expected. Your points drop by ${ACTION_POINTS_MOVE}.`;
        },
      },
    ],
    activities: [
      {
        name: "Cycle on the Magic Mountain",
        type: "motivation",
        run: (p: Player) => {
          p.motivation += ACTIVITY_MOTIVATION_MOVE;
          return `Well.. turns out this sculpture is not suited for cycling, but there were many tourists cheering you on anyways. Your motivation increases by ${ACTIVITY_MOTIVATION_MOVE}.`;
        },
      },
    ],
  },
  {
    name: "Arnhem",
    actions: [
      {
        run: (p: Player) => {
          p.points += ACTION_POINTS_MOVE;
          return `You step off your bike in the Sonsbeek park. The peacefulness restores your points by ${ACTION_POINTS_MOVE}.`;
        },
      },
      {
        run: (p: Player) => {
          p.points -= ACTION_POINTS_MOVE;
          return `You did a detour to Doetinchem. This cost you ${ACTION_POINTS_MOVE} points.`;
        },
      },
    ],
    activities: [
      {
        name: "Visit Milou",
        type: "motivation",
        run: (p: Player) => {
          const tips = [
            "Milou tells you a secret shortcut how to cycle faster to Wageningen.",
            "Milou pumps your bikes tires.",
            "Milou explains to you why cycling is the best sport.",
          ];
          const prefix =
            p.name.toLowerCase() === "milou"
              ? "You take a quick nap on your couch."
              : tips[Math.floor(Math.random() * tips.length)];

          p.motivation += ACTIVITY_MOTIVATION_MOVE;
          return `${prefix} You points increase by ${ACTIVITY_MOTIVATION_MOVE}.`;
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
