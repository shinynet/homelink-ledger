<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-img src="logo.png" style="width: 180px; height: 75px"/>
        </q-toolbar-title>

        <wallet-selector class="xs-hide"/>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>
          Navigation
        </q-item-label>

        <EssentialLink
          v-for="link in navigation"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

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
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { LocalStorage } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
import WalletSelector from 'components/WalletSelector.vue'

const navigation = [
  {
    title: 'Dashboard',
    icon: 'grid_view',
    link: '/'
  },
  {
    title: 'Playground',
    icon: 'toys',
    link: '/playground'
  }
]

const walletId = LocalStorage.getItem('wallet')
const walletApi = window.cardano[walletId]

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
