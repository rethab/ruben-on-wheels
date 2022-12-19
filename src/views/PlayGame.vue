<script lang="ts">
import router from "@/router";
import { useGameStore } from "@/stores/game";
import GameAction from "@/components/game/GameAction.vue";
import GameOverview from "@/components/game/GameOverview.vue";
import GameWinner from "@/components/game/GameWinner.vue";
import GameOver from "@/components/game/GameOver.vue";
import { defineComponent } from "vue";
const store = useGameStore();

export default defineComponent({
  components: { GameAction, GameOverview, GameWinner, GameOver },
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
          <GameAction v-else />
        </v-col>
        <v-col cols="3"><GameOverview /></v-col>
      </v-row>
    </v-container>
  </div>
</template>
