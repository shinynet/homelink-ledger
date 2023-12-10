<template>
  <q-page padding class="grid">
    <q-banner v-if="isError" class="error-banner text-white bg-red">
      {{error.message}}
    </q-banner>

    <device-card
      v-else-if="isSuccess"
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
      :value="value"
      class="card"/>
  </q-page>
</template>

<script setup>
import { watch } from 'vue'
import { useQuasar } from 'quasar'
import { useQuery } from '@tanstack/vue-query'
import { getDevices } from 'src/endpoints'
import DeviceCard from 'components/DeviceCard.vue'

const $q = useQuasar()

const { data, error, isError, isSuccess, status } = useQuery({
  queryFn: getDevices,
  queryKey: ['devices']
})

watch(status, status => {
  if (status === 'pending') {
    $q.loading.show({
      delay: 400 // ms
    })
  } else {
    $q.loading.hide()
  }
})
</script>

<style lang="scss" scoped>
.grid {
  gap: $space-base;
  display: grid;
  grid-template-rows: repeat(auto-fit, 250px);
  grid-template-columns: repeat(auto-fit, 300px);
  @media (max-width: $breakpoint-xs-max) {
    grid-template-columns: repeat(auto-fit, 100%);
  }
}
.error-banner {
  max-height: 50px;
}
</style>
