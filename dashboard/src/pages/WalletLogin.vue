<template>
  <q-page padding>
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
// import { computed, watch } from 'vue'
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

// const showWalletSelector = computed(() => data.value?.length > 1)
// console.log('showWalletSelector: ', showWalletSelector)

// watch(data, (newData) => {
//   console.log('newData: ', newData.length)
//   if (newData.length === 1) {
//     const [wallet] = newData
//     console.log('wallet: ', wallet)
//     console.log('id: ', wallet.id)
//     handleClick(wallet.id)
//   }
// })

const handleClick = id => {
  $q.localStorage.set('wallet', id)
  router.push({ name: 'Dashboard' })
}
</script>
