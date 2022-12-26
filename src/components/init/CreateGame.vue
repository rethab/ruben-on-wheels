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
        :key="index"
        :error-messages="errors[index]"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="addPlayer"
        prepend-icon="mdi-plus"
        color="primary"
        variant="outlined"
        >Add More Players</v-btn
      >
      <v-spacer />
      <v-btn
        color="primary"
        variant="tonal"
        @click="startGame"
        prepend-icon="mdi-play"
        >Start</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";
import router from "@/router";

const players = computed<{ name: string }[]>(() => [
  { name: "" },
  { name: "" },
]);

const errors = computed<string[]>(() => ["", ""]);

function addPlayer() {
  players.value.push({ name: "" });
  errors.value.push();
}

function startGame() {
  let hasError = false;
  for (let i = 0; i < players.value.length; i++) {
    if (!players.value[i].name) {
      errors.value[i] = "Please enter a name";
      hasError = true;
    } else errors.value[i] = "";
  }

  if (hasError) {
    return;
  }

  const { initPlayers } = useGameStore();
  initPlayers(players.value);
  router.push({ name: "play" });
}
</script>
