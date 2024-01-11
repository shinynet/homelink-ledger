<template>
  <q-select
    v-if="showWalletSelector"
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
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getWallets } from 'src/endpoints'

const $q = useQuasar()
const router = useRouter()

const { data } = useQuery({
  queryFn: getWallets,
  queryKey: ['wallets']
})

const showWalletSelector = computed(() => data.value?.length > 1)

const model = ref($q.localStorage.getItem('wallet'))

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
