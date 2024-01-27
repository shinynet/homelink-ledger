<template>
  <q-list padding style="max-width: 500px">
    <q-item-label header>Devices</q-item-label>
    <token-burning-device
      v-for="{assetName, quantity} in tokensQuery"
      :key="assetName"
      ref="deviceRefs"
      :name="assetName"
      :quantity="quantity"
      v-model="selectedTokens"/>

    <q-separator spaced/>

    <token-settings v-model="licenseKey"/>

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
import TokenSettings from 'components/token/TokenSettings.vue'

const { loading, notify } = useQuasar()
const queryClient = useQueryClient()

defineOptions({ name: 'token-minting' })

const mint = useMintToken()

const { data: tokensQuery } = useQuery({
  queryFn: getTokens,
  queryKey: ['tokens']
})

const deviceRefs = ref([])
const selectedTokens = ref([])
const licenseKey = ref(process.env.KEY)

const burnTokens = computed(() =>
  selectedTokens.value.map(token => ({
    ...token,
    quantity: -token.quantity
  }))
)

const isFormInValid = computed(() =>
  selectedTokens.value.length === 0
)

const reset = () => {
  selectedTokens.value = []
  licenseKey.value = process.env.KEY
  deviceRefs.value.forEach(r => r.reset())
}

const invalidateQueries = () => {
  queryClient.invalidateQueries({ queryKey: ['devices'] })
  queryClient.invalidateQueries({ queryKey: ['tokens'] })
}

const handleSubmit = () => {
  loading.show({
    message: 'Burning Tokens. Please wait...',
    boxClass: 'bg-primary'
  })

  mint(burnTokens, licenseKey)
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
