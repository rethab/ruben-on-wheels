<template>
  <v-card>
    <v-card-title>{{ winner }} has arrived in Wageningen 🚲</v-card-title>
    <v-card-subtitle v-if="winner === 'Ruben' || winner === 'ruben'"
      >Of course he wins his own Game.</v-card-subtitle
    >
    <v-card-subtitle v-else>Don't forget to pay Ruben a visit!</v-card-subtitle>

    <v-card-text
      >It was a long and bumpy ride, but the mission is accomplished.
      Congratulations!</v-card-text
    >
    <v-card-actions>
      <v-btn color="success"
        ><router-link to="/init">Play Again</router-link></v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  winner: { type: String, required: true },
});
</script>
