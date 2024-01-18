<template>
  <q-header>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="handleToggle"/>

      <q-toolbar-title>
        <q-img src="logo.png" style="width: 180px; height: 75px"/>
      </q-toolbar-title>

      <wallet-selector class="xs-hide"/>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import WalletSelector from 'components/WalletSelector.vue'

const emit = defineEmits(['toggle'])

const handleToggle = () => {
  emit('toggle')
}

defineOptions({ name: 'layout-header' })
</script>
