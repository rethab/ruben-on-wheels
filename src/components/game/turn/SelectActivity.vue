<template>
  <TurnCard :player="player" :step="1">
    <div
      class="incident"
      :class="action.effect === 'decrease' ? 'incident--bad' : 'incident--good'"
    >
      <span class="incident-icon" aria-hidden="true">{{
        action.effect === "decrease" ? "😭" : "😎"
      }}</span>
      <div>
        <p class="incident-text">{{ action.text }}</p>
        <p class="incident-effect num">
          Your {{ action.type }}
          {{ action.effect }}{{ action.type === "points" ? "" : "s" }} by
          {{ move }}.
        </p>
      </div>
    </div>

    <p class="decide-q">How do you want to proceed?</p>

    <fieldset class="options">
      <legend class="sr-only">Choose an activity</legend>
      <label
        v-for="(activity, index) in cityActivities"
        :key="index"
        class="opt"
        :class="{
          'opt--on': selectedName === activity.name,
          'opt--off': !selectableActivity(activity),
        }"
      >
        <input
          class="opt-input"
          type="radio"
          name="activity"
          :value="activity.name"
          :disabled="!selectableActivity(activity)"
          @change="selectedName = activity.name"
        />
        <span class="opt-radio" aria-hidden="true"></span>
        <span class="opt-name">{{ activity.name }}</span>
        <span class="opt-cost num">({{ costDescription(activity, player) }})</span>
      </label>
    </fieldset>

    <template #actions>
      <button
        class="btn btn-primary"
        :disabled="!selectedActivity"
        @click="selectedActivity && $emit('selectedActivity', selectedActivity)"
      >
        <span aria-hidden="true">▸</span> Run Activity
      </button>
    </template>
  </TurnCard>
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
import TurnCard from "@/components/game/turn/TurnCard.vue";

interface Props {
  player: Player;
  action: Action;
}

const props = defineProps<Props>();

defineEmits<{
  (e: "selectedActivity", activity: Activity): void;
}>();

const selectedName = ref<string>();

const selectedActivity = computed(() =>
  cityActivities.value.find((a) => a.name === selectedName.value)
);

const move = computed(() =>
  props.action.type === "motivation" ? ACTION_MOTIVATION_MOVE : ACTION_POINTS_MOVE
);

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
</script>

<style scoped>
.incident {
  display: flex;
  gap: 14px;
  padding: 16px 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: rgba(10, 14, 26, 0.45);
  margin-bottom: 20px;
}
.incident--bad {
  border-color: rgba(255, 84, 112, 0.3);
}
.incident--good {
  border-color: rgba(198, 242, 78, 0.3);
}

.incident-icon {
  font-size: 1.7rem;
  line-height: 1;
}

.incident-text {
  margin: 0 0 6px;
}

.incident-effect {
  margin: 0;
  font-size: 0.86rem;
  letter-spacing: 0.03em;
  color: var(--muted);
}
.incident--bad .incident-effect {
  color: var(--danger);
}
.incident--good .incident-effect {
  color: var(--hiviz);
}

.decide-q {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin: 0 0 14px;
}

.options {
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opt {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: rgba(10, 14, 26, 0.4);
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}
.opt:hover {
  border-color: var(--muted);
}
.opt--on {
  border-color: var(--hiviz);
  background: rgba(198, 242, 78, 0.07);
  box-shadow: inset 0 0 0 1px rgba(198, 242, 78, 0.3);
}
.opt--off {
  opacity: 0.4;
  cursor: not-allowed;
}

.opt-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.opt--off .opt-input {
  cursor: not-allowed;
}

.opt-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--line);
  flex-shrink: 0;
  position: relative;
  transition: border-color 0.18s ease;
}
.opt--on .opt-radio {
  border-color: var(--hiviz);
}
.opt--on .opt-radio::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: var(--hiviz);
  box-shadow: 0 0 8px var(--hiviz);
}

.opt-input:focus-visible + .opt-radio {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
}

.opt-name {
  font-family: var(--font-display);
  font-weight: 600;
  flex: 1;
}

.opt-cost {
  font-size: 0.82rem;
  color: var(--muted);
  letter-spacing: 0.02em;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
