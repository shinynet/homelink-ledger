<template>
  <q-page padding class="grid">
    <device-card
      v-for="{
        id,
        controlPairs,
        location,
        name,
        status,
        statusImage,
        value
      } in devices"
      :key="id"
      :control-pairs="controlPairs"
      :id="id"
      :location="location"
      :name="name"
      :status="status"
      :status-image="statusImage"
      :value="value"
      class="card"/>

    <q-inner-loading
      :showing="showLoading"
      label="Please wait..."/>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import DeviceCard from 'components/DeviceCard.vue'
import { getDevices, getTokens } from 'src/endpoints'

const {
  data: tokens,
  isLoading: isTokensLoading,
  isSuccess: tokensIsSuccess
} = useQuery({
  queryFn: getTokens,
  queryKey: ['tokens']
})

const tokenList = computed(() =>
  tokens.value?.map(({ assetName }) => assetName)
)

const showLoading = computed(() =>
  isTokensLoading.value || isDevicesLoading.value
)

const {
  data: devices,
  isLoading: isDevicesLoading
} = useQuery({
  queryFn: getDevices,
  queryKey: ['devices'],
  enabled: tokensIsSuccess,
  select: devices => devices.filter(
    ({ name }) => tokenList.value.includes(name)
  )
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
