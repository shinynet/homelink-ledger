<template>
  <q-list padding style="max-width: 500px">
    <q-item-label header>Devices</q-item-label>
    <token-minting-device
      v-for="{location, name, id} in deviceQuery"
      :key="id"
      :location="location"
      :name="name"
      :id="id"
      ref="deviceRefs"
      @select="handleDeviceSelect"
      @unselect="handleDeviceUnselect"
      @change="handleDeviceChange"/>

    <q-separator spaced/>

    <token-minting-device
      ref="adminRef"
      :id="0"
      name="Admin"
      location=""
      @select="handleDeviceSelect"
      @unselect="handleDeviceUnselect"
      @change="handleDeviceChange"/>

    <q-separator spaced/>

    <token-settings v-model="licenseKey"/>

    <q-item>
      <q-btn
        label="Mint"
        color="primary"
        :disabled="isFormInValid"
        class="full-width"
        @click="handleSubmit"/>
    </q-item>
  </q-list>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getDevices } from 'src/endpoints'
import { useMintToken } from 'src/composables/mintToken'
import TokenMintingDevice from 'components/token/TokenMintingDevice.vue'
import TokenSettings from 'components/token/TokenSettings.vue'

const { loading, notify } = useQuasar()
const queryClient = useQueryClient()

defineOptions({ name: 'token-minting' })

const mint = useMintToken()

const { data: deviceQuery } = useQuery({
  queryFn: getDevices,
  queryKey: ['devices']
})

const adminRef = ref()
const deviceRefs = ref([])
const selectedDevices = ref([])
const licenseKey = ref(process.env.KEY)

const isFormInValid = computed(() =>
  selectedDevices.value.length === 0
)

const reset = () => {
  selectedDevices.value = []
  licenseKey.value = process.env.KEY
  adminRef.value.reset()
  deviceRefs.value.forEach(r => r.reset())
}

const invalidateQueries = () => {
  queryClient.invalidateQueries({ queryKey: ['devices'] })
  queryClient.invalidateQueries({ queryKey: ['tokens'] })
}

const handleDeviceSelect = device => {
  selectedDevices.value.push(device)
}

const handleDeviceUnselect = device => {
  const index = selectedDevices.value.findIndex(
    ({ id }) => id === device.id
  )
  selectedDevices.value.splice(index, 1)
}

const handleDeviceChange = device => {
  const index = selectedDevices.value.findIndex(
    ({ id }) => id === device.id
  )
  selectedDevices.value.splice(index, 1, device)
}

const handleSubmit = () => {
  loading.show({
    message: 'Minting Tokens. Please wait...',
    boxClass: 'bg-primary'
  })

  mint(selectedDevices, licenseKey)
    .then(() => {
      notify({
        progress: true,
        message: 'Tokens minted successfully',
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
      reset()
      loading.hide()
      setTimeout(invalidateQueries, 2000)
    })
}

onBeforeUnmount(() => {
  loading.hide()
})
</script>
