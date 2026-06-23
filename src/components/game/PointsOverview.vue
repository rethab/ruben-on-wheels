<template>
  <div class="roster-tel">
    <h2 class="eyebrow roster-tel-title">Rider Telemetry</h2>
    <div class="tel-grid">
      <article
        v-for="(player, index) in sortedPlayers"
        :key="player.name"
        class="panel tel-card"
        :class="{ 'panel--lit': active(index) }"
      >
        <header class="tel-card-head">
          <span
            class="tel-avatar num"
            :class="{ 'tel-avatar--active': active(index) }"
            >{{ player.name.charAt(0).toUpperCase() }}</span
          >
          <div class="tel-id">
            <span class="tel-name" :class="{ 'tel-name--idle': !active(index) }">{{
              player.name
            }}</span>
            <span class="tel-city">{{ player.currentCity }}</span>
          </div>
          <span v-if="active(index)" class="chip chip--live tel-flag"
            ><span class="dot"></span>On road</span
          >
        </header>

        <div class="tel-gauges">
          <div class="gauge" :class="active(index) ? 'gauge--cyan' : 'gauge--idle'">
            <div class="gauge-head">
              <span class="gauge-label">Motivation</span>
              <span class="gauge-val num">{{ player.motivation }}%</span>
            </div>
            <div class="gauge-track">
              <span
                class="gauge-fill"
                :style="{ width: pct(player.motivation, 100) }"
              ></span>
            </div>
          </div>

          <div class="gauge" :class="active(index) ? 'gauge--amber' : 'gauge--idle'">
            <div class="gauge-head">
              <span class="gauge-label">Points</span>
              <span class="gauge-val num">{{ player.points }}</span>
            </div>
            <div class="gauge-track">
              <span
                class="gauge-fill"
                :style="{ width: pct(player.points, 500) }"
              ></span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Player } from "@/services/types";

interface Props {
  players: Player[];
  currentPlayerIndex: number;
}

const props = defineProps<Props>();

const sortedPlayers = computed(() => {
  const currentAndAfter = props.players.slice(
    props.currentPlayerIndex,
    props.players.length
  );
  const untilCurrent = props.players.slice(0, props.currentPlayerIndex);
  return [...currentAndAfter, ...untilCurrent];
});

function active(index: number): boolean {
  return index === 0;
}

function pct(value: number, max: number): string {
  return `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
}
</script>

<style scoped>
.roster-tel-title {
  margin: 0 0 14px;
}

.tel-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.tel-card {
  padding: 16px 18px;
  transition: border-color 0.2s ease, opacity 0.2s ease;
}

.tel-card:not(.panel--lit) {
  opacity: 0.78;
}

.tel-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.tel-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--muted);
  background: rgba(10, 14, 26, 0.6);
  border: 1px solid var(--line);
  flex-shrink: 0;
}

.tel-avatar--active {
  color: #0a0e1a;
  background: var(--hiviz);
  border-color: var(--hiviz);
  box-shadow: 0 0 18px -2px rgba(198, 242, 78, 0.6);
}

.tel-id {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  flex: 1;
  min-width: 0;
}

.tel-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.02rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tel-name--idle {
  color: var(--muted);
}

.tel-city {
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--faint);
}

.tel-flag {
  flex-shrink: 0;
}

.tel-gauges {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
