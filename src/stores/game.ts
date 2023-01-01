import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { Player } from "@/services/types";
import { cities } from "@/services/cities";
import { RemoteStoreService } from "@/services/remote";

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

  async function createGame(newPlayers: { name: string }[]): Promise<string> {
    players.value = newPlayers.map(({ name }) => {
      return { name, currentCity: "Zurich", motivation: 75, points: 500 };
    });
    console.log(`registered ${newPlayers.length} players`);

    gameId.value = crypto.randomUUID();

    await persist();

    return gameId.value;
  }

  async function updatePlayer(
    player: Player,
    city: string,
    points: number,
    motivation: number
  ) {
    const p = players.value.find(({ name }) => name === player.name)!;
    p.currentCity = city;
    p.points = points;
    p.motivation = motivation;

    await persist();
  }

  async function playerOut() {
    players.value = players.value.filter(
      (p, index) => currentPlayerIndex.value !== index
    );
    if (currentPlayerIndex.value === players.value.length) {
      currentPlayerIndex.value = 0;
    }

    await persist();
  }

  async function nextPlayer() {
    currentPlayerIndex.value++;
    if (currentPlayerIndex.value >= players.value.length) {
      currentPlayerIndex.value = 0;
    }
    await persist();
  }

  // REMOTE

  async function persist() {
    const remoteStoreService = new RemoteStoreService();
    await remoteStoreService.save(gameId.value, {
      players: players.value,
      currentPlayerIndex: currentPlayerIndex.value,
    });
  }

  async function restore(id: string): Promise<boolean> {
    const remoteStoreService = new RemoteStoreService();
    const state = await remoteStoreService.fetch(id);

    gameId.value = id;
    players.value = state.players;
    currentPlayerIndex.value = state.currentPlayerIndex;

    return players.value.length > 0;
  }

  return {
    players,
    playerOut,
    restore,
    winner,
    createGame,
    currentPlayer,
    currentPlayerIndex,
    nextPlayer,
    updatePlayer,
  };
});
