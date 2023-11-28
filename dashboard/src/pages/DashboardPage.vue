<template>
  <q-page padding class="grid">
    <device-card
      v-for="{
        ref,
        ControlPairs: controlPairs,
        location,
        location2,
        name,
        status,
        status_image: statusImage,
        value
      } in devices"
      :key="ref"
      :control-pairs="controlPairs"
      :id="ref"
      :location="location"
      :location2="location2"
      :name="name"
      :status="status"
      :status-image="statusImage"
      :value="value"/>
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
