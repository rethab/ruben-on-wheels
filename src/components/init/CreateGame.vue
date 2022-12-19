<template>
  <v-card>
    <v-card-title>Start new Game</v-card-title>
    <v-card-subtitle>Enter the names of the players</v-card-subtitle>
    <v-card-text>
      <v-text-field
        v-for="(player, index) in players"
        :label="`Player ${index + 1}`"
        v-model="player.name"
        clearable
        :rules="[(v) => (!!v && v.length > 2) || 'Too short']"
        :key="index"
      ></v-text-field>
      <v-btn @click="addPlayer" size="x-small" color="blue"
        ><v-icon icon="mdi-plus"
      /></v-btn>
      Add More Players
      <v-card-actions class="mt-5">
        <v-btn @click="startGame" color="success">Start</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useGameStore } from "@/stores/game";
import router from "@/router";

const players = reactive([{ name: "" }, { name: "" }]);

function addPlayer() {
  players.push({ name: "" });
}

function startGame() {
  const { initPlayers } = useGameStore();
  initPlayers(players);
  router.push({ name: "play" });
}
</script>
