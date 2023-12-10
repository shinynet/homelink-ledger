<template>
  <q-page padding>
    <h1 class="text-h5">Select a wallet to continue</h1>
    <q-list  bordered separator>
      <q-item
        v-for="{id, name, icon} in data"
        :key="name"
        clickable
        v-ripple
        @click="handleClick(id)">
        <q-item-section avatar>
          <q-avatar>
            <img :src="icon" alt="Wallet Icon">
          </q-avatar>
        </q-item-section>
        <q-item-section>{{name}}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getWalletsQuery } from 'src/endpoints'

const $q = useQuasar()
const router = useRouter()

const { data } = useQuery({
  queryFn: getWalletsQuery,
  queryKey: ['wallets']
})

const handleClick = id => {
  $q.localStorage.set('wallet', id)
  router.push({ name: 'Dashboard' })
}
</script>
