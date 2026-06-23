import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { Action, Player } from "@/services/types";
import { cities } from "@/services/cities";

const STORAGE_KEY = "ruben-on-wheels:game";

// In-progress turn state. Kept in the store (not in the GameAction component)
// so a refresh resumes exactly where the player was, rather than silently
// re-running the turn — which would apply a fresh city action on top of the
// one already committed. Activities are referenced by name because their
// `text()` thunk is not serialisable.
interface TurnState {
  step: number;
  action: Action | null;
  activityName: string | null;
  pointsCost: number;
  motivationCost: number;
  looser: string | null;
}

function freshTurn(): TurnState {
  return {
    step: 0,
    action: null,
    activityName: null,
    pointsCost: 0,
    motivationCost: 0,
    looser: null,
  };
}

interface PersistedGame {
  players: Player[];
  currentPlayerIndex: number;
  gameId: string;
  turn: TurnState;
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
  const turn = ref<TurnState>(saved?.turn ?? freshTurn());

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
          turn: turn.value,
        })
      );
    } catch {
      /* storage unavailable — game still playable in-memory */
    }
  }

  watch([players, currentPlayerIndex, gameId, turn], persist, { deep: true });

  // ACTIONS

  function createGame(newPlayers: { name: string }[]): string {
    players.value = newPlayers.map(({ name }) => {
      return { name, currentCity: "Zurich", motivation: 75, points: 500 };
    });
    console.log(`registered ${newPlayers.length} players`);

    currentPlayerIndex.value = 0;
    turn.value = freshTurn();
    gameId.value = crypto.randomUUID();

    return gameId.value;
  }

  function endGame() {
    players.value = [];
    currentPlayerIndex.value = 0;
    turn.value = freshTurn();
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
    turn.value = freshTurn();
  }

  function nextPlayer() {
    currentPlayerIndex.value++;
    if (currentPlayerIndex.value >= players.value.length) {
      currentPlayerIndex.value = 0;
    }
    turn.value = freshTurn();
  }

  return {
    players,
    gameId,
    turn,
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
