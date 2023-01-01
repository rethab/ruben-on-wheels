<template>
  <div>
    <ShowLooser v-if="looser" :player="player" @next-player="nextPlayer" />
    <CityIntro
      v-else-if="step === 0"
      :player="player"
      @explore-city="exploreCity"
    />
    <SelectActivity
      v-else-if="step === 1 && action"
      :action="action"
      :player="player"
      @selected-activity="runActivity"
    />
    <ShowActivityText
      v-else-if="step === 2 && activity"
      :activity="activity"
      :player="player"
      :points-cost="pointsCost"
      :motivation-cost="motivationCost"
      @next-player="nextPlayer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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

interface Props {
  player: Player;
}

const props = defineProps<Props>();

const emits = defineEmits(["playerOut", "nextPlayer"]);

const step = ref<number>(0);
const action = ref<Action>();
const activity = ref<Activity>();
const pointsCost = ref<number>(0);
const motivationCost = ref<number>(0);
const looser = ref<string>();

function exploreCity() {
  action.value = selectRandomAction(props.player.currentCity);
  console.log(
    `Picked action ${action.value.text} for player ${props.player.name}`
  );

  runActionOnPlayer(action.value, props.player);

  step.value++;
}

function runActivity(selectedActivity: Activity) {
  const pointsBefore = props.player.points;
  const motivationBefore = props.player.motivation;

  runActivityOnPlayer(selectedActivity, props.player);

  activity.value = selectedActivity;
  pointsCost.value = pointsBefore - props.player.points;
  motivationCost.value = motivationBefore - props.player.motivation;

  step.value++;
}

function nextPlayer() {
  step.value = 0;
  action.value = undefined;
  activity.value = undefined;
  pointsCost.value = 0;
  motivationCost.value = 0;

  if (looser.value) {
    emits("playerOut");
    looser.value = "";
  } else {
    emits("nextPlayer");
  }
}

watch(step, () => {
  const lost = props.player.points <= 0 || props.player.motivation <= 0;

  if (lost) {
    looser.value = props.player.name;
  }
});
</script>
