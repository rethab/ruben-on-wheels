<template>
  <section class="panel turn" :class="{ 'turn--lost': lost }">
    <span class="panel-rail" aria-hidden="true"></span>

    <header class="turn-head">
      <span class="turn-avatar num" :class="{ 'turn-avatar--lost': lost }">{{
        player.name.charAt(0).toUpperCase()
      }}</span>
      <div class="turn-id">
        <h2 class="turn-name display">{{ player.name }}'s Turn</h2>
        <span class="turn-loc">Checkpoint · {{ player.currentCity }}</span>
      </div>

      <ol v-if="!lost" class="steps" aria-label="Turn progress">
        <li
          v-for="(label, i) in STEPS"
          :key="i"
          class="step"
          :class="{ 'step--on': i === step, 'step--done': i < step }"
        >
          <span class="step-dot"></span>
          <span class="step-label">{{ label }}</span>
        </li>
      </ol>
      <span v-else class="chip turn-out">Eliminated</span>
    </header>

    <div class="stat-strip">
      <div class="stat" :class="{ 'stat--low': lowMotivation }">
        <span class="stat-label">Motivation</span>
        <span class="stat-val num">{{ player.motivation }}%</span>
        <div class="stat-track">
          <span
            class="stat-fill stat-fill--cyan"
            :style="{ width: pct(player.motivation, 100) }"
          ></span>
        </div>
      </div>
      <div class="stat" :class="{ 'stat--low': lowPoints }">
        <span class="stat-label">Points</span>
        <span class="stat-val num">{{ player.points }}</span>
        <div class="stat-track">
          <span
            class="stat-fill stat-fill--amber"
            :style="{ width: pct(player.points, 500) }"
          ></span>
        </div>
      </div>
    </div>

    <div class="turn-body">
      <slot />
    </div>

    <footer class="turn-actions">
      <slot name="actions" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Player } from "@/services/types";

interface Props {
  player: Player;
  step?: number;
  lost?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  step: 0,
  lost: false,
});

const STEPS = ["Scout", "Decide", "Outcome"];

const lowMotivation = computed(() => props.player.motivation <= 20);
const lowPoints = computed(() => props.player.points <= 120);

function pct(value: number, max: number): string {
  return `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
}
</script>

<style scoped>
.turn {
  padding: 26px 28px;
}

.turn--lost {
  border-color: rgba(255, 84, 112, 0.4);
}

.turn-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.turn-avatar {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  font-weight: 700;
  font-size: 1.3rem;
  color: #0a0e1a;
  background: var(--hiviz);
  box-shadow: 0 0 22px -3px rgba(198, 242, 78, 0.6);
  flex-shrink: 0;
}
.turn-avatar--lost {
  background: var(--danger);
  color: #fff;
  box-shadow: 0 0 22px -3px rgba(255, 84, 112, 0.6);
}

.turn-id {
  flex: 1;
  min-width: 0;
}

.turn-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.turn-loc {
  font-size: 0.74rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--faint);
}

.turn-out {
  color: var(--danger);
  border-color: rgba(255, 84, 112, 0.4);
}

/* Step indicator */
.steps {
  display: flex;
  gap: 18px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 7px;
}

.step-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--line);
  border: 1px solid var(--line);
  transition: all 0.25s ease;
}

.step-label {
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--faint);
  transition: color 0.25s ease;
}

.step--done .step-dot {
  background: var(--hiviz-dim);
  border-color: var(--hiviz-dim);
}

.step--on .step-dot {
  background: var(--hiviz);
  border-color: var(--hiviz);
  box-shadow: 0 0 10px var(--hiviz);
}
.step--on .step-label {
  color: var(--text);
}

/* Stat strip */
.stat-strip {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  background: rgba(10, 14, 26, 0.45);
  margin-bottom: 22px;
}

.stat {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  gap: 4px 10px;
}

.stat-label {
  font-family: var(--font-display);
  font-size: 0.64rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.stat-val {
  font-weight: 700;
  font-size: 1.1rem;
  text-align: right;
}

.stat-track {
  grid-column: 1 / -1;
  height: 6px;
  border-radius: 999px;
  background: rgba(10, 14, 26, 0.8);
  overflow: hidden;
  border: 1px solid var(--line-soft);
}

.stat-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.stat-fill--cyan {
  background: linear-gradient(90deg, #2aa6d9, var(--cyan));
}
.stat-fill--amber {
  background: linear-gradient(90deg, #d98a1f, var(--amber));
}

.stat--low .stat-val {
  color: var(--danger);
}
.stat--low .stat-fill {
  background: linear-gradient(90deg, #b3273f, var(--danger));
}

.turn-body {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--text);
}

.turn-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 560px) {
  .turn {
    padding: 22px 18px;
  }
  .steps {
    display: none;
  }
  .turn-actions .btn {
    flex: 1;
  }
}
</style>
