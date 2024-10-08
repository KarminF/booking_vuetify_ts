<template>
  <v-row class="cards">
    <v-col cols="12" md="4" v-for="device in devices" :key="device.id">
      <v-card
        :title="device.name"
        subtitle="this is a subtitle"
        :text="device.description"
        :to="{ path: '/calendar', query: { deviceName: device.name } }"
      ></v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
interface Device {
  name: string;
  description: string;
  id: number;
}
const props = defineProps<{
  devices: Array<Device>;
}>();
</script>
