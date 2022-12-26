<template>
  <v-card>
    <v-card-title>{{ props.player.name }}'s turn</v-card-title>
    <v-card-subtitle><span v-html="props.subtitle" /></v-card-subtitle>

    <v-card-text>
      <p v-html="actionText" />
      <p class="my-5">How do you want to proceed?</p>

      <v-radio-group v-model="activityName">
        <v-radio
          :disabled="!selectableActivity(activity)"
          v-for="(activity, index) in cityActivities"
          :key="index"
          :label="activityLabel(activity)"
          :value="activity.name"
        ></v-radio>
      </v-radio-group>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="selectActivity" color="primary" variant="tonal"
        >Run Activity</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Action, Activity, Player } from "@/services/types";
import {
  ACTION_MOTIVATION_MOVE,
  ACTION_POINTS_MOVE,
  costDescription,
  cycleCost,
  getCityActivities,
} from "@/services/cities";
import { computed, ref } from "vue";

interface Props {
  player: Player;
  subtitle: string;
  action: Action;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: "selectedActivity", activity: Activity): void;
}>();

const activityName = ref("");

function selectActivity(): void {
  if (!activityName.value) {
    console.log("no activity selected");
    return;
  }

  const activity = cityActivities.value.find(
    (a) => a.name === activityName.value
  );

  emits("selectedActivity", activity!);
}

function activityLabel(activity: Activity): string {
  return `${activity.name} (${costDescription(activity, props.player)})`;
}

function selectableActivity(a: Activity): boolean {
  if (a.type !== "cycle") {
    return true;
  }

  return canAffordToCycle();
}

function canAffordToCycle(): boolean {
  const { player } = props;
  const { motivation, points } = cycleCost(player);
  return player.motivation >= motivation && player.points >= points;
}

const cityActivities = computed(() => {
  const city = props.player.currentCity;
  return getCityActivities(city!);
});

const actionText = computed(() => {
  const {
    action: { text, type, effect },
  } = props;

  const move =
    type === "motivation" ? ACTION_MOTIVATION_MOVE : ACTION_POINTS_MOVE;
  const smiley = effect === "decrease" ? "😭" : "😎";

  let fullText = text;
  fullText += "<br /><br />";
  fullText += `${smiley} Your ${type} ${effect}${
    type === "points" ? "" : "s"
  } by ${move}.`;

  return fullText;
});
</script>
