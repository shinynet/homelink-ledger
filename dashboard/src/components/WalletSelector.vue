<template>
  <q-select
    filled
    dense
    emit-value
    bg-color="white"
    v-model="model"
    :options="data"
    label="Wallet"
    class="select"
    option-label="name"
    option-value="id"/>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getWalletsQuery } from 'src/endpoints'

const $q = useQuasar()
const router = useRouter()

const model = ref($q.localStorage.getItem('wallet'))

const { data } = useQuery({
  queryFn: getWalletsQuery,
  queryKey: ['wallets']
})

watch(model, id => {
  $q.localStorage.set('wallet', id)
  router.go()
})
</script>

<style scoped>
.select {
  width: 150px;
}
</style>
