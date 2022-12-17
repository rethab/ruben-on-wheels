import type { Action, Activity, City, Player } from "@/services/types";

const genericActions: Action[] = [
  {
    run: (p: Player) => {
      p.motivation += 5;
      return "What a nice weather today! Your motivation increases by 5 and you can't wait to get on.";
    },
  },
  {
    run: (p: Player) => {
      p.motivation -= 5;
      return "Uuuuh this rain. If you only you had stayed at home and not started this adventure! Your motivation drops by 5.";
    },
  },
  {
    run: (p: Player) => {
      p.points -= 10;
      return "You have a flat tire. Repairing it costs you 10 points.";
    },
  },
  {
    run: (p: Player) => {
      p.points -= 10;
      return "You got stopped by the police, because you were cycling without light. The fine costs you 10 points.";
    },
  },
];

const genericActivities: Activity[] = [
  {
    name: "Take a nap",
    run: (p: Player) => {
      p.motivation -= 5;
      p.points += 10;
      return "You feel ready for the next step, but napping also felt very nice and its difficult to get back on the bike. Your motivation drops by 5, but your points increase 10";
    },
  },
  {
    name: "Cycle to the next city",
    run: (p: Player) => {
      p.currentCity = getNextCity(p.currentCity);
      p.points -= 10;
      return `Well done, you have cycled to ${p.currentCity}. Your points may have dropped by 10, but that was worth it!`;
    },
  },
];

export const cities: City[] = [
  {
    name: "Zurich",
    actions: [
      {
        run: (p: Player) => {
          p.motivation -= 5;
          return "You had a coffee in the city center. When you paid for it, you realised how expensive coffees are in Zurich. Your motivation drops by 5 points.";
        },
      },
    ],
    activities: [
      {
        name: "Visit Laurie & Reto",
        run: (p: Player) => {
          p.motivation += 5;
          return "You had some fondue with white wine. You feel very full, but your ready for your adventure. Your motivation increases by 5 points.";
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
          p.points -= 20;
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
