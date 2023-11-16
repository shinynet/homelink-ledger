<template>
  <q-page padding class="grid">
    <device-card v-for="device in devices" :key="device.ref" v-bind="device"/>
  </q-page>
</template>

<script setup>
import { api } from 'boot/axios'
import { useQuery } from '@tanstack/vue-query'
import DeviceCard from 'components/DeviceCard.vue'

const { data: devices } = useQuery({
  queryFn: () => api.get('JSON', {
    params: {
      request: 'getstatus',
      everything: true,
      ref: '74,75,6,37'
    }
  })
    .then(({ data }) => data.Devices)
    .then(devices => devices.map(device => ({ ...device, id: device.ref }))),
  queryKey: ['devices']
})
</script>

<style scoped>
.grid {
  display: grid;
  gap: 16px;
}
</style>
