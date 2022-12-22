<script lang="ts">
import router from "@/router";
import { useGameStore } from "@/stores/game";
import GameAction from "@/components/game/GameAction.vue";
import RouteOverview from "@/components/game/RouteOverview.vue";
import PointsOverview from "@/components/game/PointsOverview.vue";
import GameWinner from "@/components/game/GameWinner.vue";
import GameOver from "@/components/game/GameOver.vue";
import { defineComponent } from "vue";
const store = useGameStore();

export default defineComponent({
  components: {
    PointsOverview,
    GameAction,
    RouteOverview,
    GameWinner,
    GameOver,
  },
  beforeRouteEnter() {
    if (!store.isGameRunning) {
      router.push({ name: "home" });
    }
  },
  computed: {
    winner() {
      return store.winner?.name;
    },
    gameOver() {
      const { players } = useGameStore();
      return players.length === 0;
    },
  },
});
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="9">
          <GameOver v-if="gameOver" />
          <GameWinner v-else-if="winner" :winner="winner" />
          <div v-else>
            <GameAction />
            <PointsOverview />
          </div>
        </v-col>
        <v-col cols="3"><RouteOverview /></v-col>
      </v-row>
    </v-container>
  </div>
</template>
