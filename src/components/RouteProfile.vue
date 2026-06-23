<template>
  <div class="route" :class="`route--${variant}`">
    <svg
      :viewBox="`0 0 ${W} ${H}`"
      class="route-svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Elevation profile of the route from Zurich to Wageningen"
    >
      <defs>
        <linearGradient id="routeArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(198,242,78,0.22)" />
          <stop offset="100%" stop-color="rgba(198,242,78,0)" />
        </linearGradient>
        <linearGradient id="routeLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#4de1ff" />
          <stop offset="55%" stop-color="#c6f24e" />
          <stop offset="100%" stop-color="#ff3d7f" />
        </linearGradient>
      </defs>

      <!-- horizon baseline -->
      <line
        :x1="padX"
        :x2="W - padX"
        :y1="H - padBottom"
        :y2="H - padBottom"
        stroke="var(--line)"
        stroke-dasharray="2 6"
      />

      <!-- elevation area + ridge -->
      <path :d="areaPath" fill="url(#routeArea)" class="route-area" />
      <path
        :d="linePath"
        fill="none"
        stroke="url(#routeLine)"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="route-ridge"
      />

      <!-- checkpoints -->
      <g v-for="(c, i) in points" :key="c.name">
        <line
          :x1="c.x"
          :x2="c.x"
          :y1="c.y"
          :y2="H - padBottom"
          stroke="var(--line)"
          stroke-width="1"
          opacity="0.6"
        />
        <circle
          :cx="c.x"
          :cy="c.y"
          :r="isActiveCity(c.name) ? 7 : 4.5"
          :class="['route-node', { 'route-node--active': isActiveCity(c.name), 'route-node--done': isDone(i) }]"
        />
        <text
          :x="c.x"
          :y="H - padBottom + 22"
          text-anchor="middle"
          class="route-label"
          :class="{ 'route-label--active': isActiveCity(c.name) }"
        >
          {{ c.name }}
        </text>
        <text
          v-if="variant === 'hero'"
          :x="c.x"
          :y="c.y - 12"
          text-anchor="middle"
          class="route-elev num"
        >
          {{ c.elev }}m
        </text>
      </g>

      <!-- rider markers -->
      <g v-for="r in riders" :key="r.key" class="rider" :transform="`translate(${r.x}, ${r.y})`">
        <circle
          :r="9"
          :class="['rider-dot', { 'rider-dot--active': r.active }]"
        />
        <text text-anchor="middle" dy="0.35em" class="rider-initial">{{ r.initial }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { City, Player } from "@/services/types";

interface Props {
  cities: City[];
  players?: Player[];
  currentPlayer?: Player;
  variant?: "hero" | "play";
}

const props = withDefaults(defineProps<Props>(), {
  players: () => [],
  variant: "play",
});

const W = 1000;
const H = 200;
const padX = 60;
const padTop = 46;
const padBottom = 44;

// Artistic elevations (metres) — the descent from the Alps to the Dutch lowlands.
const ELEV: Record<string, number> = {
  Zurich: 408,
  Basel: 260,
  Köln: 55,
  Duisburg: 33,
  Arnhem: 13,
  Wageningen: 16,
};

const elevs = computed(() => props.cities.map((c) => ELEV[c.name] ?? 50));
const maxE = computed(() => Math.max(...elevs.value));
const minE = computed(() => Math.min(...elevs.value));

function xFor(i: number) {
  const n = props.cities.length;
  if (n <= 1) return W / 2;
  return padX + (i * (W - 2 * padX)) / (n - 1);
}

function yFor(elev: number) {
  const range = maxE.value - minE.value || 1;
  const t = (elev - minE.value) / range;
  return padTop + (1 - t) * (H - padTop - padBottom);
}

const points = computed(() =>
  props.cities.map((c, i) => ({
    name: c.name,
    elev: ELEV[c.name] ?? 50,
    x: xFor(i),
    y: yFor(ELEV[c.name] ?? 50),
  }))
);

// Smooth ridge via Catmull-Rom -> cubic bezier
const linePath = computed(() => {
  const p = points.value;
  if (p.length < 2) return "";
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
});

const areaPath = computed(() => {
  const p = points.value;
  if (p.length < 2) return "";
  return `${linePath.value} L ${p[p.length - 1].x} ${H - padBottom} L ${p[0].x} ${
    H - padBottom
  } Z`;
});

function cityIndex(name?: string) {
  return props.cities.findIndex((c) => c.name === name);
}

function isActiveCity(name: string) {
  return props.currentPlayer?.currentCity === name;
}

function isDone(i: number) {
  // a checkpoint is "behind" the active rider
  const active = cityIndex(props.currentPlayer?.currentCity);
  return active >= 0 && i < active;
}

// Stack riders sharing a city so they don't overlap.
const riders = computed(() => {
  const byCity: Record<string, Player[]> = {};
  for (const pl of props.players) {
    (byCity[pl.currentCity] ??= []).push(pl);
  }
  const out: {
    key: string;
    x: number;
    y: number;
    initial: string;
    active: boolean;
  }[] = [];
  for (const [city, list] of Object.entries(byCity)) {
    const idx = cityIndex(city);
    if (idx < 0) continue;
    const bx = xFor(idx);
    const by = yFor(ELEV[city] ?? 50);
    list.forEach((pl, k) => {
      out.push({
        key: pl.name,
        x: bx + (k - (list.length - 1) / 2) * 22,
        y: by - 26,
        initial: pl.name.charAt(0).toUpperCase(),
        active: pl.name === props.currentPlayer?.name,
      });
    });
  }
  return out;
});
</script>

<style scoped>
.route {
  width: 100%;
}

.route-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

.route-ridge {
  filter: drop-shadow(0 6px 14px rgba(198, 242, 78, 0.18));
  stroke-dasharray: 2600;
  stroke-dashoffset: 2600;
  animation: draw 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.route-area {
  opacity: 0;
  animation: fade 1.6s ease 0.6s forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes fade {
  to { opacity: 1; }
}

.route-node {
  fill: var(--ink-2);
  stroke: var(--muted);
  stroke-width: 2;
}
.route-node--done {
  fill: var(--hiviz-dim);
  stroke: var(--hiviz-dim);
}
.route-node--active {
  fill: var(--hiviz);
  stroke: #fff;
  filter: drop-shadow(0 0 8px var(--hiviz));
}

.route-label {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.06em;
  fill: var(--muted);
}
.route-label--active {
  fill: var(--text);
}

.route-elev {
  font-size: 12px;
  fill: var(--faint);
}

.rider-dot {
  fill: var(--panel-2);
  stroke: var(--muted);
  stroke-width: 2;
}
.rider-dot--active {
  fill: var(--hiviz);
  stroke: #0a0e1a;
  filter: drop-shadow(0 0 10px rgba(198, 242, 78, 0.8));
}
.rider-initial {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  fill: var(--text);
}
.rider-dot--active + .rider-initial,
.rider .rider-dot--active ~ .rider-initial {
  fill: #0a0e1a;
}
.rider {
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.route--hero .route-label {
  font-size: 15px;
}
</style>
