<template>
  <q-page padding class="flex-center column">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey full-width"
      active-color="accent"
      indicator-color="accent"
      align="justify"
      narrow-indicator
      style="max-width: 500px">
      <q-route-tab name="mails" label="Mint Tokens" to="/tokens/mint"/>
      <q-route-tab name="alarms" label="Burn Tokens" to="/tokens/burn"/>
    </q-tabs>
    <router-view class="self-center col-grow"/>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'tokens-page' })

const tab = ref()
</script>

<style lang="scss" scoped>
.content-class {
  margin: 0 auto;
}
</style>
