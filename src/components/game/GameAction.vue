<template>
  <div>
    <ShowLooser
      v-if="looser"
      :city-name="player.currentCity"
      :player-name="looser"
      :subtitle="subtitle"
      @next-player="nextPlayer"
    />
    <CityIntro
      v-else-if="step === 0"
      :player="player"
      :subtitle="subtitle"
      @explore-city="exploreCity"
    />
    <SelectActivity
      v-else-if="step === 1 && action"
      :action="action"
      :subtitle="subtitle"
      :player="player"
      @selected-activity="runActivity"
    />
    <ShowActivityText
      v-else-if="step === 2 && activity"
      :activity="activity"
      :subtitle="subtitle"
      :player="player"
      :points-cost="pointsCost"
      :motivation-cost="motivationCost"
      @next-player="nextPlayer"
    />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { computed, ref, watch } from "vue";
import {
  selectRandomAction,
  runActionOnPlayer,
  runActivityOnPlayer,
} from "@/services/cities";
import type { Action, Activity, Player } from "@/services/types";
import CityIntro from "@/components/game/turn/CityIntro.vue";
import SelectActivity from "@/components/game/turn/SelectActivity.vue";
import ShowActivityText from "@/components/game/turn/ShowActivityText.vue";
import ShowLooser from "@/components/game/turn/ShowLooser.vue";

const step = ref<number>(0);
const action = ref<Action>();
const activity = ref<Activity>();
const pointsCost = ref<number>(0);
const motivationCost = ref<number>(0);
const looser = ref<string>();

const store = useGameStore();

const player = computed<Player>(() => {
  return store.currentPlayer!;
});

const subtitle = computed(() => {
  const { points, currentCity, motivation } = player.value;

  return `Points: ${points}, Motivation: ${motivation} City: ${currentCity}`;
});

function exploreCity() {
  action.value = selectRandomAction(player.value.currentCity);
  console.log(
    `Picked action ${action.value.text} for player ${player.value.name}`
  );

  runActionOnPlayer(action.value, player.value);

  step.value++;
}

function runActivity(selectedActivity: Activity) {
  const pointsBefore = player.value.points;
  const motivationBefore = player.value.motivation;

  runActivityOnPlayer(selectedActivity, player.value);

  activity.value = selectedActivity;
  pointsCost.value = pointsBefore - player.value.points;
  motivationCost.value = motivationBefore - player.value.motivation;

  step.value++;
}

function nextPlayer() {
  step.value = 0;
  action.value = undefined;
  activity.value = undefined;
  pointsCost.value = 0;
  motivationCost.value = 0;

  const store = useGameStore();
  if (looser.value) {
    store.playerOut();
    looser.value = "";
  } else {
    store.nextPlayer();
  }
}

watch(step, () => {
  const lost = player.value.points <= 0 || player.value.motivation <= 0;

  if (lost) {
    looser.value = player.value.name;
  }
});
</script>
