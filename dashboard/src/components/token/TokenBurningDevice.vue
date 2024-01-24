<template>
  <q-item tag="label" v-ripple>
    <q-item-section side>
      <q-checkbox v-model="selected"/>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ assetName }}</q-item-label>
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

defineOptions({ name: 'token-burning-device' })

const props = defineProps({
  assetName: { type: String, required: true },
  assetQty: { type: Number, required: true }
})

const emit = defineEmits([
  'select',
  'unselect',
  'change'
])

const selected = ref(false)
const quantity = ref(1)

const burnQty = computed(() => -quantity.value)

const payload = computed(() => ({
  name: props.assetName,
  quantity: burnQty.value
}))

const quantityRules = computed(() => [
  value => value > 0 || '1 minimum',
  value => value <= props.assetQty || `${props.assetQty} maximum`
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
