<template>
  <q-item tag="label" v-ripple>
    <q-item-section side>
      <q-checkbox
        v-model="model"
        :val="device"/>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
      <q-item-label caption>{{ location }}</q-item-label>
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
      {{device}}
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed, ref } from 'vue'

defineOptions({ name: 'token-minting-device' })

const props = defineProps({
  location: { type: String, required: true },
  name: { type: String, required: true },
  id: { type: Number, required: true }
})

const model = defineModel()

const device = ref({
  id: props.id,
  name: props.name,
  quantity: 1
})

const quantityRules = computed(() => [
  value => value > 0 || '1 minimum',
  value => value <= 100 || '100 maximum'
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
