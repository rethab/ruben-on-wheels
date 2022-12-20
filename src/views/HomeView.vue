<script lang="ts">
import router from "@/router";
import { defineComponent } from "vue";
import ActionButton from "@/components/misc/ActionButton.vue";

export default defineComponent({
  components: { ActionButton },
  methods: {
    router() {
      return router;
    },
  },
});
</script>

<template>
  <main>
    <div>
      <v-card>
        <v-card-title>Welcome to Ruben on Wheels 🚴🏽</v-card-title>
        <v-card-text>
          This is a fun multiplayer game where everybody cycles from Zurich to
          Wageningen
        </v-card-text>

        <v-card-title>How it Works</v-card-title>
        <v-card-text class="ml-5">
          <ul>
            <li>There are at least two players</li>
            <li>Every player starts with 500 points, and a 75 motivation</li>
            <li>You're cycling from city to city until you reach Wageningen</li>
            <li>
              Cycling to the next city costs you both points and motivation
            </li>
            <li>The lower your motivation, the more points it costs</li>
            <li>The first player to arrive wins</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <ActionButton text="Begin" link="init" />
        </v-card-actions>
      </v-card>
    </div>
  </main>
</template>
