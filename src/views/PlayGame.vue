<template>
  <div class="play shell">
    <section class="panel spine">
      <span class="panel-rail" aria-hidden="true"></span>
      <div class="spine-head">
        <span class="eyebrow">Live Route · Zürich → Wageningen</span>
        <span v-if="currentPlayer" class="chip chip--live">
          <span class="dot"></span>{{ currentPlayer.name }} on the road
        </span>
      </div>
      <RouteOverview
        :cities="cities"
        :players="store.players"
        :current-player="currentPlayer"
      />
    </section>

    <GameOver v-if="gameOver" />
    <GameWinner v-else-if="winner" :winner="winner" />
    <div v-else class="play-grid">
      <GameAction
        :player="currentPlayer"
        @next-player="store.nextPlayer()"
        @player-out="store.playerOut()"
      />
      <PointsOverview
        :players="store.players"
        :current-player-index="store.currentPlayerIndex"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { cities } from "@/services/cities";
import GameAction from "@/components/game/GameAction.vue";
import RouteOverview from "@/components/game/RouteOverview.vue";
import PointsOverview from "@/components/game/PointsOverview.vue";
import GameWinner from "@/components/game/GameWinner.vue";
import GameOver from "@/components/game/GameOver.vue";
import { computed } from "vue";

const store = useGameStore();

const winner = computed(() => store.winner?.name);
const gameOver = computed(() => store.players.length === 0);
const currentPlayer = computed(() => store.players[store.currentPlayerIndex]);
</script>

<style scoped>
.play {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.spine {
  padding: 18px 22px 8px;
}

.spine-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 2px;
}

.play-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 22px;
  align-items: start;
}

@media (max-width: 880px) {
  .play-grid {
    grid-template-columns: 1fr;
  }
}
</style>
