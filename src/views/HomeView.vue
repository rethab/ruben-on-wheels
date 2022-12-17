<script setup lang="ts"></script>

<template>
  <main>
    <div>
      <h2>Welcome to Ruben on Wheels</h2>
      <p>
        This is a fun game where players need to cycle from Zurich to Wageningen
      </p>
      <p>
        The player who first arrives in Wageningen wins, but there are obstacles
        on the way..
      </p>
      <p>
        <router-link :to="{ name: 'init' }">Begin</router-link>
        the fun <v-icon icon="mdi-play" />
      </p>
    </div>
  </main>
</template>
