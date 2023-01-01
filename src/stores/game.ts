import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { Player } from "@/services/types";
import { cities } from "@/services/cities";

export const useGameStore = defineStore("game", () => {
  const players = ref([] as Player[]);
  const currentPlayerIndex = ref(0);
  const gameId = ref();

  // GETTERS

  const isGameRunning = computed(
    () => gameId.value && players.value.length != 0
  );

  const currentPlayer = computed(() => {
    if (!isGameRunning.value) return;
    return players.value[currentPlayerIndex.value];
  });

  const winner = computed(() => {
    if (!isGameRunning.value) return;
    const lastCity = cities[cities.length - 1];
    return players.value.find(
      ({ currentCity }) => currentCity == lastCity.name
    );
  });

  // ACTIONS

  function createGame(newPlayers: { name: string }[]): string {
    players.value = newPlayers.map(({ name }) => {
      return { name, currentCity: "Zurich", motivation: 75, points: 500 };
    });
    console.log(`registered ${newPlayers.length} players`);

    gameId.value = crypto.randomUUID();

    return gameId.value;
  }

  function updatePlayer(
    player: Player,
    city: string,
    points: number,
    motivation: number
  ) {
    const p = players.value.find(({ name }) => name === player.name)!;
    p.currentCity = city;
    p.points = points;
    p.motivation = motivation;
  }

  function playerOut() {
    players.value = players.value.filter(
      (p, index) => currentPlayerIndex.value !== index
    );
    if (currentPlayerIndex.value === players.value.length) {
      currentPlayerIndex.value = 0;
    }
  }

  function nextPlayer() {
    currentPlayerIndex.value++;
    if (currentPlayerIndex.value >= players.value.length) {
      currentPlayerIndex.value = 0;
    }
  }

  return {
    players,
    playerOut,
    isGameRunning,
    winner,
    createGame,
    currentPlayer,
    currentPlayerIndex,
    nextPlayer,
    updatePlayer,
  };
});
