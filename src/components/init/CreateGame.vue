<template>
  <div class="reg shell">
    <header class="reg-head">
      <p class="eyebrow">Rider Registration</p>
      <h1 class="display reg-title">Start new Game</h1>
      <p class="reg-sub">
        Enter the names of the riders lining up in Zürich. Minimum two on the
        grid.
      </p>
    </header>

    <div class="panel reg-panel">
      <span class="panel-rail" aria-hidden="true"></span>

      <ul class="roster">
        <li v-for="(player, index) in players" :key="index" class="roster-row">
          <span class="roster-no num">{{ String(index + 1).padStart(2, "0") }}</span>
          <v-text-field
            :label="`Player ${index + 1}`"
            v-model="player.name"
            variant="solo-filled"
            density="comfortable"
            hide-details="auto"
            clearable
            :error-messages="errors[index]"
            class="roster-field"
          ></v-text-field>
        </li>
      </ul>

      <div class="reg-actions">
        <button class="btn btn-ghost" @click="addPlayer">
          <span aria-hidden="true">＋</span> Add More Players
        </button>
        <button class="btn btn-primary" @click="startGame">
          <span aria-hidden="true">▸</span> Start
        </button>
      </div>
    </div>

    <p class="reg-foot num">
      Grid: {{ namedCount }} / {{ players.length }} riders named
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useGameStore } from "@/stores/game";
import router from "@/router";

const players = ref([{ name: "" }, { name: "" }]);

const errors = ref(["", ""]);

const namedCount = computed(
  () => players.value.filter((p) => p.name?.trim()).length
);

function addPlayer() {
  players.value.push({ name: "" });
  errors.value.push();
}

function startGame() {
  let hasError = false;
  for (let i = 0; i < players.value.length; i++) {
    if (!players.value[i].name) {
      errors.value[i] = "Please enter a name";
      hasError = true;
    } else {
      errors.value[i] = "";
    }
  }

  if (hasError) {
    return;
  }

  const { createGame } = useGameStore();
  const id = createGame(players.value);
  router.push({ name: "play", params: { id } });
}
</script>

<style scoped>
.reg {
  max-width: 680px;
}

.reg-head {
  text-align: center;
  margin-bottom: 26px;
}

.reg-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin: 10px 0 12px;
}

.reg-sub {
  color: var(--muted);
  margin: 0 auto;
  max-width: 42ch;
  line-height: 1.6;
}

.reg-panel {
  padding: 28px;
}

.roster {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.roster-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.roster-no {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--hiviz);
  width: 2ch;
  flex-shrink: 0;
}

.roster-field {
  flex: 1;
}

.reg-actions {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.reg-foot {
  text-align: center;
  margin-top: 18px;
  color: var(--faint);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

@media (max-width: 520px) {
  .reg-actions .btn {
    flex: 1;
  }
}
</style>
