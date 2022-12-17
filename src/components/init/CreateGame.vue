<template>
  <h2>Start New Game</h2>
  <p>Create the players:</p>
  <p><i>You need at least two to start a game</i></p>
  <v-card>
    <v-container>
      <v-text-field
        v-for="(player, index) in players"
        :label="`Player ${index + 1}`"
        v-model="player.name"
        clearable
        :rules="[(v) => (!!v && v.length > 2) || 'Too short']"
        :key="index"
      ></v-text-field>
      <v-btn @click="addPlayer" color="blue"><v-icon icon="mdi-plus" /></v-btn>
      <v-divider />
      <v-card-actions>
        <v-btn @click="startGame" color="success">Start</v-btn>
      </v-card-actions>
    </v-container>
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
