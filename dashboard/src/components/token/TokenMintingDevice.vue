<template>
  <q-item tag="label" v-ripple>
    <q-item-section side>
      <q-checkbox v-model="selected"/>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ deviceName }}</q-item-label>
      <q-item-label caption>{{ location2 }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-input
        dense
        label="Qty"
        mask="###"
        standout
        hide-bottom-space
        v-model.number="quantity"
        class="quantity-field"
        :rules="quantityRules"/>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'token-minting-device' })

const props = defineProps({
  location: { type: String, required: true },
  location2: { type: String, required: true },
  name: { type: String, required: true },
  deviceId: { type: Number, required: true }
})

const emit = defineEmits([
  'select',
  'unselect',
  'change'
])

const selected = ref(false)
const quantity = ref(1)

const deviceName = computed(() =>
  `${props.location} ${props.name}`
)

const payload = computed(() => ({
  deviceId: props.deviceId,
  name: deviceName.value,
  quantity: quantity.value
}))

const quantityRules = computed(() => [
  value => value > 0 || '1 minimum',
  value => value <= 100 || '100 maximum'
])

const reset = () => {
  selected.value = false
  quantity.value = 1
}

watch(selected, value => {
  value
    ? emit('select', payload.value)
    : emit('unselect', payload.value)
})

watch(quantity, () => {
  if (selected.value) {
    emit('change', payload.value)
  }
})

defineExpose({ reset })
</script>

<style scoped lang="scss">
.quantity-field {
  max-width: 100px;
}
</style>
