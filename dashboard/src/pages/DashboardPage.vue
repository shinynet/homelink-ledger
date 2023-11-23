<template>
  <q-page padding class="grid">
    <device-card
      v-for="device in devices"
      :key="device.ref"
      v-bind="device"/>
  </q-page>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query'
import { getStatusQuery } from 'src/endpoints'
import DeviceCard from 'components/DeviceCard.vue'

const { data: devices } = useQuery({
  queryFn: getStatusQuery,
  queryKey: ['devices']
})
</script>

<style scoped>
.grid {
  display: grid;
  gap: 16px;
}
</style>
