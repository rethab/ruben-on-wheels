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

<script lang="ts">
import { defineComponent } from "vue";
import { useGameStore } from "@/stores/game";
import router from "@/router";

export default defineComponent({
  data() {
    return {
      players: [{ name: "" }, { name: "" }],
      errors: ["", ""],
    };
  },
  methods: {
    addPlayer() {
      this.players.push({ name: "" });
      this.errors.push();
    },

    startGame() {
      let hasError = false;
      for (let i = 0; i < this.players.length; i++) {
        if (!this.players[i].name) {
          this.errors[i] = "Please enter a name";
          hasError = true;
        } else this.errors[i] = "";
      }

      if (hasError) {
        return;
      }

      const { initPlayers } = useGameStore();
      initPlayers(this.players);
      router.push({ name: "play" });
    },
  },
});
</script>
