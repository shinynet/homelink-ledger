<template>
  <q-page padding>

      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator>
        <q-route-tab name="mails" label="Mint Tokens" to="/tokens/mint" />
        <q-route-tab name="alarms" label="Burn Tokens" to="/tokens/burn" />
      </q-tabs>

    <router-view />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'tokens-page' })

const tab = ref()
</script>
