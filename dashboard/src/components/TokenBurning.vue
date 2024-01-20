<template>
  <q-list padding style="max-width: 500px">
    <q-item-label header>Devices</q-item-label>
    <token-burning-device
      ref="deviceRefs"
      v-for="{assetName, quantity} in tokensQuery"
      :key="assetName"
      :assetName="assetName"
      :assetQty="quantity"
      @select="handleDeviceSelect"
      @unselect="handleDeviceUnselect"
      @change="handleDeviceChange"/>

    <q-separator spaced/>

    <q-expansion-item
      icon="settings"
      label="Settings">
      <q-card>
        <q-card-section>
          <q-input
            dense
            v-model="key"
            label="License Key"/>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-item>
      <q-btn
        label="Burn"
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
import { getTokens } from 'src/endpoints'
import { useMintToken } from 'src/composables/mintToken'
import TokenBurningDevice from 'components/token/TokenBurningDevice.vue'

const { loading, notify } = useQuasar()
const queryClient = useQueryClient()

defineOptions({ name: 'token-minting' })

const mint = useMintToken()

const { data: tokensQuery } = useQuery({
  queryFn: getTokens,
  queryKey: ['tokens']
})

const deviceRefs = ref([])
const selectedDevices = ref([])
const mintAdminToken = ref(false)
const adminTokenQty = ref(1)
const key = ref(process.env.KEY)

const isFormInValid = computed(() =>
  mintAdminToken.value === false &&
  selectedDevices.value.length === 0
)

const reset = () => {
  selectedDevices.value = []
  mintAdminToken.value = false
  key.value = process.env.KEY
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
    ({ deviceId }) => deviceId === device.deviceId
  )
  selectedDevices.value.splice(index, 1)
}

const handleDeviceChange = device => {
  const index = selectedDevices.value.findIndex(
    ({ deviceId }) => deviceId === device.deviceId
  )
  selectedDevices.value.splice(index, 1, device)
}

const handleSubmit = () => {
  loading.show({
    message: 'Burning Tokens. Please wait...',
    boxClass: 'bg-primary'
  })

  const adminToken = {
    name: 'Admin',
    deviceId: 0,
    quantity: adminTokenQty.value
  }
  const devices = mintAdminToken.value
    ? [...selectedDevices.value, adminToken]
    : selectedDevices

  mint(devices, key)
    .then(() => {
      notify({
        progress: true,
        message: 'Tokens burned successfully',
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

<style scoped lang="scss">
.quantity-field {
  max-width: 100px;
}
</style>
