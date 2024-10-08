<template>
  <NavBar />
  <h1>{{ deviceName }}</h1>
  <BookingCalendar :deviceName="deviceName"/>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const deviceName: string = route.query.deviceName as string;
</script>
