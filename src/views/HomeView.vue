<script setup lang="ts"></script>

<template>
  <main>
    <div>
      <v-card elevation="0">
        <v-card-title>Welcome to Ruben on Wheels 🚴🏽</v-card-title>
        <v-card-text>
          This is a fun multiplayer game where everybody cycles from Zurich to
          Wageningen
        </v-card-text>
      </v-card>

      <v-card elevation="0">
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
          <router-link :to="{ name: 'init' }">Begin</router-link
          ><v-icon icon="mdi-play" />
        </v-card-actions>
      </v-card>
    </div>
  </main>
</template>
