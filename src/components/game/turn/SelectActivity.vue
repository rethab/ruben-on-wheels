<template>
  <v-card>
    <v-card-title>{{ player.name }}'s turn</v-card-title>
    <CardSubtitle :player="player" />

    <v-card-text>
      <p v-html="actionText" />
      <p class="my-5">How do you want to proceed?</p>

      <v-radio-group>
        <v-radio
          :disabled="!selectableActivity(activity)"
          v-for="(activity, index) in cityActivities"
          :key="index"
          :label="activityLabel(activity)"
          :value="activity.name"
          @change="selectedActivity = activity"
        ></v-radio>
      </v-radio-group>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        @click="selectedActivity && $emit('selectedActivity', selectedActivity)"
        color="primary"
        variant="tonal"
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
import CardSubtitle from "@/components/game/turn/CardSubtitle.vue";

interface Props {
  player: Player;
  action: Action;
}

const props = defineProps<Props>();

defineEmits<{
  (e: "selectedActivity", activity: Activity): void;
}>();

const selectedActivity = ref<Activity>();

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
