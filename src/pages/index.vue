<template>
  <NavBar />
  <Temp />
  <DeviceList :devices="devices" />
</template>

<script lang="ts" setup>
interface Device {
  name: string;
  description: string;
  id: number;
}
const devices: Array<Device> = [
  {
    name: "device 1",
    description: "description 1",
    id: 1,
  },
  {
    name: "device 2",
    description: "description 2",
    id: 2,
  },
  {
    name: "device 3",
    description: "description 3",
    id: 3,
  },
  {
    name: "device 4",
    description: "description 4",
    id: 4,
  },
];
</script>
