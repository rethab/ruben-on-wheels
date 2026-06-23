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
import { computed } from "vue";
import { getCityActivities, selectRandomAction } from "@/services/cities";
import type { Activity, Player } from "@/services/types";
import CityIntro from "@/components/game/turn/CityIntro.vue";
import SelectActivity from "@/components/game/turn/SelectActivity.vue";
import ShowActivityText from "@/components/game/turn/ShowActivityText.vue";
import ShowLooser from "@/components/game/turn/ShowLooser.vue";
import { GameService } from "@/services/game";
import { useGameStore } from "@/stores/game";

interface Props {
  player: Player;
}

const props = defineProps<Props>();

const emits = defineEmits(["playerOut", "nextPlayer"]);

const store = useGameStore();
const gameService = new GameService(store);

// Turn progress lives in the store so a refresh resumes mid-turn instead of
// re-running it. The selected activity is re-resolved from its name since the
// persisted state only holds serialisable data.
const step = computed(() => store.turn.step);
const action = computed(() => store.turn.action ?? undefined);
const looser = computed(() => store.turn.looser ?? undefined);
const pointsCost = computed(() => store.turn.pointsCost);
const motivationCost = computed(() => store.turn.motivationCost);

const activity = computed<Activity | undefined>(() => {
  const name = store.turn.activityName;
  if (!name) return undefined;
  return getCityActivities(props.player.currentCity).find(
    (a) => a.name === name
  );
});

function exploreCity() {
  const picked = selectRandomAction(props.player.currentCity);
  gameService.runActionOnPlayer(picked, props.player);

  store.turn.action = picked;
  store.turn.step = 1;
  checkLost();
}

function runActivity(selectedActivity: Activity) {
  const pointsBefore = props.player.points;
  const motivationBefore = props.player.motivation;

  gameService.runActivityOnPlayer(selectedActivity, props.player);

  store.turn.activityName = selectedActivity.name;
  store.turn.pointsCost = pointsBefore - props.player.points;
  store.turn.motivationCost = motivationBefore - props.player.motivation;
  store.turn.step = 2;
  checkLost();
}

function nextPlayer() {
  // store.nextPlayer()/playerOut() reset the turn for the next rider.
  if (looser.value) {
    emits("playerOut");
  } else {
    emits("nextPlayer");
  }
}

function checkLost() {
  if (props.player.points <= 0 || props.player.motivation <= 0) {
    store.turn.looser = props.player.name;
  }
}
</script>
