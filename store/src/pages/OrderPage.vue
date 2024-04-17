<template>
  <q-page class="row flex-center" padding>
    <order-card
      v-model="selectedWallet"
      :show-loading="showLoading"
      :wallets="wallets"
      @place-order="handlePlaceOrder"/>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { uid } from 'quasar'
import OrderCard from 'components/OrderCard.vue'

defineOptions({ name: 'order-page' })

const router = useRouter()

const wallets = computed(() => Object.values(window.cardano)
  .filter(x => Object.hasOwnProperty.call(x, 'apiVersion')))

const selectedWallet = ref()
const showLoading = ref(false)
const processed = ref(false)
const license = uid()
console.log('license: ', license)

const handlePlaceOrder = () => {
  showLoading.value = true

  // TODO: execute payment

  setTimeout(() => {
    showLoading.value = false
    processed.value = true
  }, 3000)
}

watch(processed, isProcessed => {
  if (isProcessed) { router.replace({ name: 'Processed' }) }
})
</script>
