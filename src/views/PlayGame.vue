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

<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import GameAction from "@/components/game/GameAction.vue";
import RouteOverview from "@/components/game/RouteOverview.vue";
import PointsOverview from "@/components/game/PointsOverview.vue";
import GameWinner from "@/components/game/GameWinner.vue";
import GameOver from "@/components/game/GameOver.vue";
import { computed } from "vue";

const winner = computed(() => useGameStore().winner?.name);
const gameOver = computed(() => useGameStore().players.length === 0);
</script>
