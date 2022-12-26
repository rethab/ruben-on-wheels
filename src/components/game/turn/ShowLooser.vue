<template>
  <v-card>
    <v-card-title>{{ playerName }}'s turn</v-card-title>
    <v-card-subtitle>
      <span class="text-red">{{ subtitle }}</span>
    </v-card-subtitle>

    <v-card-text
      >😭 Oh no, {{ playerName }}! You have to take the train from
      {{ cityName }} to Wageningen.
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('nextPlayer')" color="primary" variant="tonal"
        >Next Player</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  playerName: { type: String, required: true },
  subtitle: { type: String, required: true },
  cityName: { type: String, required: true },
});
defineEmits(["nextPlayer"]);
</script>
