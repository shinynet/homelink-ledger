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
/* eslint-disable no-unused-vars */
import { computed, onBeforeUnmount, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getTokens } from 'src/endpoints'
import { useMintToken } from 'src/composables/mintToken'
import TokenBurningDevice from 'components/token/TokenBurningDevice.vue'
import TokenSettings from 'components/token/TokenSettings.vue'

const { dialog, loading, notify } = useQuasar()
const queryClient = useQueryClient()

defineOptions({ name: 'token-burning' })

const mint = useMintToken()

const { data: tokensQuery } = useQuery({
  queryFn: getTokens,
  queryKey: ['tokens']
})

const deviceRefs = ref([])
const selectedTokens = ref([])
const licenseKey = ref(process.env.KEY)

const burningTokens = computed(() =>
  selectedTokens.value.map(token => ({
    ...token,
    quantity: -token.quantity
  }))
)

const adminOwnedQty = computed(() =>
  tokensQuery.value?.find(
    token => token.assetName === 'Admin'
  )?.quantity
)

const adminBurnQty = computed(() =>
  burningTokens.value.find(
    token => token.name === 'Admin'
  )?.quantity
)

const burningLastAdmin = computed(() =>
  adminOwnedQty.value + adminBurnQty.value === 0
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

const burnTokens = () => {
  loading.show({
    message: 'Burning Tokens. Please wait...',
    boxClass: 'bg-primary'
  })

  mint(burningTokens, licenseKey)
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

const handleSubmit = () => {
  if (burningLastAdmin.value) {
    dialog({
      title: 'Confirm',
      message: 'You\'re burning your last admin token which may prevent you from burning tokens in the future',
      cancel: true,
      persistent: true
    }).onOk(() => {
      burnTokens()
    })
  } else {
    burnTokens()
  }
}

onBeforeUnmount(() => {
  loading.hide()
})
</script>
