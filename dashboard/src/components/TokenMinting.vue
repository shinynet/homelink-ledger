<template>
  <q-list bordered padding>
    <q-item-label header>Devices</q-item-label>
    <q-item
      tag="label"
      v-ripple
      v-for="{location, location2, name, ref} in devices"
      :key="ref">
      <q-item-section side top>
        <q-checkbox
          v-model="selectedTokens"
          :val="ref"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{location}} {{name}}</q-item-label>
        <q-item-label caption>{{ location2 }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item-label header>Admin Token</q-item-label>
    <q-item tag="label" v-ripple>
      <q-item-section side top>
        <q-checkbox v-model="selectedTokens" :val="0" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Admin</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>

  <div class="q-px-sm">
    The model data: <strong>{{ selectedTokens }}</strong>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getDevices } from 'src/endpoints'

const { data: devices } = useQuery({
  queryFn: getDevices,
  queryKey: ['devices']
})

const selectedTokens = ref([])
</script>
