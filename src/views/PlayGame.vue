<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="9">
          <GameOver v-if="gameOver" />
          <GameWinner v-else-if="winner" :winner="winner" />
          <div v-else>
            <GameAction
              :player="store.currentPlayer"
              @next-player="store.nextPlayer()"
              @player-out="store.playerOut()"
            />
            <PointsOverview
              :players="players"
              :current-player-index="currentPlayerIndex"
            />
          </div>
        </v-col>
        <v-col cols="3"
          ><RouteOverview
            :cities="cities"
            :players="players"
            :current-player="currentPlayer"
        /></v-col>
      </v-row>
    </v-container>
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

const players = store.players;
const currentPlayerIndex = store.currentPlayerIndex;
</script>
