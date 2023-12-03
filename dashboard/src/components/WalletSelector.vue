<template>
  <q-select v-model="model" :options="data" label="Wallet" class="select" dense />
</template>

<script setup>
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getWalletsQuery } from 'src/endpoints'

const model = ref(null)

const { data } = useQuery({
  queryFn: getWalletsQuery,
  queryKey: ['wallets']
})
</script>

<style scoped>
.select {
  width: 100px;
}
</style>
