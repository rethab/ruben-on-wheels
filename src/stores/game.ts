import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { Player } from "@/services/types";
import { cities } from "@/services/cities";

const STORAGE_KEY = "ruben-on-wheels:game";

interface PersistedGame {
  players: Player[];
  currentPlayerIndex: number;
  gameId: string;
}

function loadPersisted(): PersistedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedGame;
    if (!data.gameId || !Array.isArray(data.players)) return null;
    return data;
  } catch {
    return null;
  }
}

export const useGameStore = defineStore("game", () => {
  const saved = loadPersisted();

  const players = ref<Player[]>(saved?.players ?? []);
  const currentPlayerIndex = ref(saved?.currentPlayerIndex ?? 0);
  const gameId = ref<string | undefined>(saved?.gameId);

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

  // PERSISTENCE — keep the browser copy in sync so a refresh can resume.

  function persist() {
    try {
      if (!gameId.value) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          players: players.value,
          currentPlayerIndex: currentPlayerIndex.value,
          gameId: gameId.value,
        })
      );
    } catch {
      /* storage unavailable — game still playable in-memory */
    }
  }

  watch([players, currentPlayerIndex, gameId], persist, { deep: true });

  // ACTIONS

  function createGame(newPlayers: { name: string }[]): string {
    players.value = newPlayers.map(({ name }) => {
      return { name, currentCity: "Zurich", motivation: 75, points: 500 };
    });
    console.log(`registered ${newPlayers.length} players`);

    currentPlayerIndex.value = 0;
    gameId.value = crypto.randomUUID();

    return gameId.value;
  }

  function endGame() {
    players.value = [];
    currentPlayerIndex.value = 0;
    gameId.value = undefined;
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
    gameId,
    playerOut,
    isGameRunning,
    winner,
    createGame,
    endGame,
    currentPlayer,
    currentPlayerIndex,
    nextPlayer,
    updatePlayer,
  };
});
