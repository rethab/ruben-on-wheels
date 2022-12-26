<template>
  <div>
    <ShowLooser
      v-if="looser"
      :city-name="city"
      :player-name="looser"
      :subtitle="subtitle"
      @next-player="nextPlayer"
    />
    <CityIntro
      v-else-if="step === 0"
      :player="currentPlayer"
      :subtitle="subtitle"
      @explore-city="exploreCity"
    />
    <SelectActivity
      v-else-if="step === 1"
      :city-action="action"
      :subtitle="subtitle"
      :player="currentPlayer"
      @selected-activity="runActivity"
    />
    <ShowActivityText
      v-else-if="step === 2"
      :activity="activity"
      :subtitle="subtitle"
      :player="currentPlayer"
      :points-cost="pointsCost"
      :motivation-cost="motivationCost"
      @next-player="nextPlayer"
    />
  </div>
</template>

<script lang="ts">
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import {
  selectRandomAction,
  runActionOnPlayer,
  runActivityOnPlayer,
} from "@/services/cities";
import type { Action, Activity } from "@/services/types";
import CityIntro from "@/components/game/turn/CityIntro.vue";
import SelectActivity from "@/components/game/turn/SelectActivity.vue";
import ShowActivityText from "@/components/game/turn/ShowActivityText.vue";
import ShowLooser from "@/components/game/turn/ShowLooser.vue";

export default defineComponent({
  components: { ShowLooser, ShowActivityText, SelectActivity, CityIntro },
  data() {
    return {
      step: 0,
      action: undefined as undefined | Action,
      activity: undefined as undefined | Activity,
      pointsCost: undefined as undefined | number,
      motivationCost: undefined as undefined | number,
      looser: undefined as undefined | string,
    };
  },
  setup() {
    const store = useGameStore();
    const { currentPlayerName, currentPlayer } = storeToRefs(store);
    return { currentPlayerName, currentPlayer };
  },
  methods: {
    exploreCity() {
      this.action = selectRandomAction(this.city!);
      console.log(
        `Picked action ${this.action.text} for player ${
          this.currentPlayer!.name
        }`
      );

      runActionOnPlayer(this.action, this.currentPlayer!);

      this.step++;
    },
    runActivity(activity: Activity) {
      const player = this.currentPlayer!;
      const pointsBefore = player.points;
      const motivationBefore = player.motivation;

      runActivityOnPlayer(activity, player);

      this.activity = activity;
      this.pointsCost = pointsBefore - player.points;
      this.motivationCost = motivationBefore - player.motivation;

      this.step++;
    },
    nextPlayer() {
      this.step = 0;
      this.action = undefined;
      this.activity = undefined;
      this.pointsCost = undefined;
      this.motivationCost = undefined;

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
    step() {
      const player = this.currentPlayer!;
      const lost = player.points <= 0 || player.motivation <= 0;

      if (lost) {
        this.looser = this.currentPlayerName!;
      }
    },
  },
  computed: {
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
