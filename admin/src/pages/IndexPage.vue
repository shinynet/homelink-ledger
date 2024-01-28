<template>
  <q-page
    class="column justify-center"
    padding>
    <q-form
      class="content-around column"
      @submit="handleSubmit">
      <q-input
        ref="licenseKeyRef"
        v-model="licenseKey"
        :rules="validation"
        dense
        filled
        mask="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        maxlength="36"
        style="min-width: 330px">
        <template v-slot:after>
          <q-btn
            color="accent"
            dense
            icon="key"
            size="md"
            @click="handleGenKey"/>
        </template>
      </q-input>

      <q-btn
        color="primary"
        label="Mint Admin Token"
        type="submit"/>
    </q-form>
  </q-page>
</template>

<script setup>
import { defineComponent, nextTick, onBeforeUnmount, ref } from 'vue'
import { uid, useQuasar } from 'quasar'
import { useMintToken } from 'src/composables/mintToken'

defineComponent({ name: 'index-page' })

const { loading, notify } = useQuasar()
const mint = useMintToken()

const licenseKey = ref('')
const licenseKeyRef = ref(null)

const validation = [
  value => !!value || 'License Key is required',
  value => value.length === 36 || 'License Key must be 36 characters'
]

const handleGenKey = () => {
  licenseKey.value = uid()
}

const handleSubmit = () => {
  loading.show({
    message: 'Minting Admin Token. Please wait...',
    boxClass: 'bg-primary'
  })

  mint(licenseKey)
    .then(() => {
      notify({
        progress: true,
        message: 'Admin token minted successfully',
        type: 'positive',
        multiLine: true
      })
    })
    .catch(error => {
      notify({
        progress: true,
        message: error.info ?? error,
        type: 'negative',
        multiLine: true
      })
    })
    .finally(() => {
      licenseKey.value = ''
      nextTick()
        .then(() => {
          licenseKeyRef.value.resetValidation()
          loading.hide()
        })
    })
}

onBeforeUnmount(() => {
  loading.hide()
})
</script>
