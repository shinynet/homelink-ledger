<template>
  <q-expansion-item
      icon="settings"
      label="Settings">
    <q-card>
      <q-card-section>
        <q-input
            dense
            v-model="licenseKey"
            label="License Key"/>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup>
defineOptions({ name: 'token-settings' })

// eslint-disable-next-line no-undef
const licenseKey = defineModel()
</script>
