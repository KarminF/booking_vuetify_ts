<template>
  <v-footer class="bg-grey-lighten-1">
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link.text"
        :to="link.url"
        class="mx-2"
        color="white"
        rounded="xl"
        variant="text"
      >
        {{ link.text }}
      </v-btn>
      <!-- <v-col class="text-center mt-4" cols="12">
          {{ new Date().getFullYear() }} — <strong>Device Calendar</strong>
        </v-col> -->
    </v-row>
  </v-footer>
</template>

<script lang="ts" setup>
  const links = [
    { text: "Home", url: "/" },
    { text: "About", url: "/" },
    { text: "Contact", url: "/" },
  ];
</script>
