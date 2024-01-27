<template>
  <q-item tag="label" v-ripple>
    <q-item-section side>
      <q-checkbox
        v-model="model"
        :val="device"/>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-input
        dense
        label="Qty"
        mask="###"
        standout
        hide-bottom-space
        v-model.number="device.quantity"
        class="quantity-field"
        :rules="quantityRules"/>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed, ref } from 'vue'

defineOptions({ name: 'token-burning-device' })

const props = defineProps({
  name: { type: String, required: true },
  quantity: { type: Number, required: true }
})

const model = defineModel()

const device = ref({
  name: props.name,
  quantity: 1
})

const quantityRules = computed(() => [
  value => value > 0 || '1 minimum',
  value => value <= props.quantity || `${props.quantity} maximum`
])

const reset = () => {
  device.value.quantity = 1
}

defineExpose({ reset })
</script>

<style scoped lang="scss">
.quantity-field {
  max-width: 100px;
}
</style>
