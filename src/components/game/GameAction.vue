<template>
  <v-card>
    <v-card-title>{{ looser || currentPlayerName }}'s turn</v-card-title>
    <v-card-subtitle>
      <span v-if="looser" class="text-red">{{ subtitle }}</span>
      <span v-else v-html="subtitle" />
    </v-card-subtitle>

    <v-card-text v-if="looser"
      >😭 Oh no, {{ looser }}! You have to take the train from {{ city }} to
      Wageningen.
    </v-card-text>
    <v-card-text v-else-if="step === 0"
      >You are currently in {{ city }}. Click below to see what happens in
      {{ city }}, and decide what activity to do next.</v-card-text
    >

    <v-card-text v-else-if="step === 1">
      {{ cityActionText }}

      <p class="my-5">How do you want to proceed?</p>

      <v-radio-group v-model="selectedActivity">
        <v-radio
          v-for="(activity, index) in cityActivities"
          :key="index"
          :label="activityLabel(activity)"
          :value="activity.name"
        ></v-radio>
      </v-radio-group>
    </v-card-text>

    <v-card-text v-else-if="step === 2">
      {{ cityActivityText }}
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        @click="nextStep"
        v-if="!looser && step === 0"
        color="primary"
        variant="tonal"
        >Explore {{ city }}</v-btn
      >
      <v-btn
        @click="nextStep"
        v-if="!looser && step === 1"
        color="primary"
        variant="tonal"
        >Run Activity</v-btn
      >
      <v-btn
        @click="nextPlayer"
        v-if="looser || step === 2"
        color="primary"
        variant="tonal"
        >Next Player</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import {
  costDescription,
  getCityAction,
  getCityActivities,
} from "@/services/cities";
import type { Activity } from "@/services/types";

export default defineComponent({
  data() {
    return {
      step: 0,
      cityActionText: "",
      selectedActivity: "",
      cityActivityText: "",
      looser: "",
    };
  },
  setup() {
    const store = useGameStore();
    const { currentPlayerName, currentPlayer } = storeToRefs(store);
    return { currentPlayerName, currentPlayer };
  },
  methods: {
    activityLabel(a: Activity) {
      const currentPlayer = useGameStore().currentPlayer!;

      return `${a.name} (${costDescription(a, currentPlayer)})`;
    },
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

      const store = useGameStore();
      if (this.looser) {
        store.playerOut();
        this.looser = "";
      } else {
        store.nextPlayer();
      }
    },
  },
  watch: {
    step(newStep: number) {
      const { currentPlayer } = useGameStore();
      // just arrived in city, run action
      if (newStep === 1) {
        const cityAction = getCityAction(this.city!);
        this.cityActionText = cityAction.run(currentPlayer!);
      }

      // selected activity, run it
      if (newStep === 2) {
        const activity: Activity = this.cityActivities.find(
          ({ name }) => name === this.selectedActivity
        )!;
        this.cityActivityText = activity.run(currentPlayer!);
      }

      const lost = currentPlayer!.points <= 0 || currentPlayer!.motivation <= 0;
      if (lost) {
        this.looser = this.currentPlayerName!;
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
