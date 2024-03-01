<template>
  <q-footer class="bg-grey-3 text-dark">
    <q-toolbar class="q-pl-none">
      <q-btn flat no-caps @click="showTokens()">
        <q-avatar>
          <img :src="walletApi.icon" alt="Wallet Icon">
        </q-avatar>
        {{ walletApi.name }}
      </q-btn>
      <q-space/>
      <wallet-selector class="xs"/>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import { LocalStorage, useQuasar } from 'quasar'
import { useQuery } from '@tanstack/vue-query'
import { getTokens } from 'src/endpoints'
import WalletSelector from 'components/WalletSelector.vue'
import { computed } from 'vue'
import labels from './labels.json'
import { fromText } from 'lucid-cardano'

const { bottomSheet } = useQuasar()

defineOptions({ name: 'layout-footer' })

const { data: tokens } = useQuery({
  queryFn: getTokens,
  queryKey: ['tokens']
})

const actions = computed(() =>
  tokens.value?.map(t => ({
    label: `${t.assetName} (${t.quantity})`,
    img: labels[0].json_metadata['8c5545dc830f72c55339ac2924a40a8097769719fafaa601da4a68eb'][fromText('Admin')].image
  }))
)

const showTokens = () => {
  bottomSheet({
    title: 'Tokens',
    grid: true,
    class: 'bg-grey-3',
    actions: actions.value
  })
}

const walletId = LocalStorage.getItem('wallet')
const walletApi = window.cardano[walletId]

console.log('labels', labels[0].json_metadata['8c5545dc830f72c55339ac2924a40a8097769719fafaa601da4a68eb'][fromText('Admin')].image)
console.log('labels', labels[0].json_metadata['8c5545dc830f72c55339ac2924a40a8097769719fafaa601da4a68eb'][fromText('Office Light')].image)
console.log('labels', labels[0].json_metadata['8c5545dc830f72c55339ac2924a40a8097769719fafaa601da4a68eb'][fromText('Storage Lights')].image)
console.log('labels', labels[0].json_metadata['8c5545dc830f72c55339ac2924a40a8097769719fafaa601da4a68eb'][fromText('Fitness Room Lights')].image)
</script>
