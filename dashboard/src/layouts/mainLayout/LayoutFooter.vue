<template>
  <q-footer class="q-pa-md bg-grey-3 text-dark">
    <q-toolbar>
      <q-avatar>
        <img :src="walletApi.icon" alt="Wallet Icon">
      </q-avatar>
      <q-toolbar-title class="xs-hide">
        <div>{{ walletApi.name }}</div>
      </q-toolbar-title>
      <q-space/>
      <wallet-selector class="xs"/>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import { LocalStorage } from 'quasar'
import WalletSelector from 'components/WalletSelector.vue'

defineOptions({ name: 'layout-footer' })

const walletId = LocalStorage.getItem('wallet')
const walletApi = window.cardano[walletId]
</script>
