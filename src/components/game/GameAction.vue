<template>
  <v-card>
    <v-card-title>{{ currentPlayerName }}'s turn!</v-card-title>
    <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
    <v-card-text v-if="step === 0"
      >You are currently in {{ city }}. Click next to see what happens in
      {{ city }}, and decide what activity to do next.</v-card-text
    >

    <v-card-text v-if="step === 1">
      {{ cityActionText }}

      <p class="my-5">How do you want to proceed?</p>

      <v-radio-group v-model="selectedActivity">
        <v-radio
          v-for="(activity, index) in cityActivities"
          :key="index"
          :label="activity.name"
          :value="activity.name"
        ></v-radio>
      </v-radio-group>
    </v-card-text>

    <v-card-text v-if="step === 2">
      {{ cityActivityText }}
    </v-card-text>

    <v-card-actions>
      <v-btn @click="nextStep" v-if="step < 2" color="success">Next</v-btn>
      <v-btn @click="nextPlayer" v-else color="success">Next Player</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { getCityAction, getCityActivities } from "@/services/cities";
import type { Activity } from "@/services/types";

export default defineComponent({
  data() {
    return {
      step: 0,
      cityActionText: "",
      selectedActivity: "",
      cityActivityText: "",
    };
  },
  setup() {
    const store = useGameStore();
    const { currentPlayerName } = storeToRefs(store);
    return { currentPlayerName };
  },
  methods: {
    nextStep() {
      if (this.step === 1 && !this.selectedActivity) {
        console.log("no activity selected");
        return;
      }
      this.step++;
    },
    nextPlayer() {
      this.step = 0;
      this.cityActionText = "";
      this.selectedActivity = "";
      this.cityActivityText = "";

      const { nextPlayer } = useGameStore();
      nextPlayer();
    },
  },
  watch: {
    step(newStep: number) {
      // just arrived in city, run action
      if (newStep === 1) {
        const { currentPlayer } = useGameStore();
        const cityAction = getCityAction(this.city!);
        this.cityActionText = cityAction.run(currentPlayer!);
        return;
      }

      // selected activity, run it
      if (newStep === 2) {
        const { currentPlayer } = useGameStore();
        const activity: Activity = this.cityActivities.find(
          ({ name }) => name === this.selectedActivity
        )!;
        this.cityActivityText = activity.run(currentPlayer!);
      }
    },
  },
  computed: {
    cityActivities() {
      const { currentPlayer } = useGameStore();
      const city = currentPlayer?.currentCity;
      return getCityActivities(city!);
    },
    city() {
      const { currentPlayer } = useGameStore();
      return currentPlayer?.currentCity;
    },
    subtitle() {
      const { currentPlayer } = useGameStore();
      const { points, currentCity, motivation } = currentPlayer!;
      return `Points: ${points}, Motivation: ${motivation} City: ${currentCity}`;
    },
  },
});
</script>
