<template>
  <q-page>

    <h2 class="text-h6">UTXOs</h2>

    <q-list bordered separator>
      <q-item v-for="utxo in utxos" :key="utxo.txHash">
        <q-item-section v-for="(value, token, i) in utxo.assets" :key="i">
          <q-item-label>{{token}}</q-item-label>
          <q-item-label caption>{{value}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <h2 class="text-h6">Posts</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <div v-else-if="posts">
      <ul>
        <li v-for="item in posts" :key="item.id">
          <a @click="$emit('setPostId', item.id)" href="#">{{ item.title }}</a>
        </li>
      </ul>
    </div>
  </q-page>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query'
import { api } from 'boot/axios'
import { lucid } from 'boot/lucid'

const { data: utxos } = useQuery({
  queryKey: ['utxos'],
  queryFn: () => lucid.wallet.getUtxos()
})

const { data: posts, error, isError, isLoading } = useQuery({
  queryFn: () => api.get('https://jsonplaceholder.typicode.com/posts').then(({ data }) => data),
  queryKey: ['posts']
})
</script>
