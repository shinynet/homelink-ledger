<template>
  <q-page padding class="grid">
    <template v-if="isPending">
      <skeleton-card v-for="n in 3" :key="n"/>
    </template>

    <q-banner v-else-if="isError" class="error-banner text-white bg-red">
      {{error.message}}
    </q-banner>

    <device-card
      v-else
      v-for="{
        ref,
        ControlPairs: controlPairs,
        location,
        location2,
        name,
        status,
        status_image: statusImage,
        value
      } in data"
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
import SkeletonCard from 'components/SkeletonCard.vue'

const { data, error, isError, isPending } = useQuery({
  queryFn: getStatusQuery,
  queryKey: ['devices']
})
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.error-banner {
  max-height: 50px;
}
</style>
