<script lang="ts">
import router from "@/router";
import { useGameStore } from "@/stores/game";
import GameAction from "@/components/game/GameAction.vue";
import GameOverview from "@/components/game/GameOverview.vue";
import GameWinner from "@/components/game/GameWinner.vue";
import { defineComponent } from "vue";
const store = useGameStore();

export default defineComponent({
  components: { GameAction, GameOverview, GameWinner },
  beforeRouteEnter() {
    if (!store.isGameRunning) {
      router.push({ name: "home" });
    }
  },
  computed: {
    winner() {
      return store.winner?.name;
    },
  },
});
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="9">
          <GameAction v-if="!winner" />
          <GameWinner v-else :winner="winner" />
        </v-col>
        <v-col cols="3"><GameOverview /></v-col>
      </v-row>
    </v-container>
  </div>
</template>
