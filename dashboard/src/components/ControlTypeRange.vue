<template>
  <q-slider
    v-model="value"
    :min="Range.RangeStart"
    :max="Range.RangeEnd"
    label
    label-always
    :label-value="Range.RangeStatusPrefix + value + Range.RangeStatusSuffix"/>
</template>

<script setup>
import { ref } from 'vue'
// const emit = defineEmits(['change'])

const props = defineProps({
  ControlType: {
    type: Number,
    required: true
  },
  ControlValue: {
    type: Number,
    required: true
  },
  Label: {
    type: String,
    required: true
  },
  Range: {
    type: Object,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

const value = ref(props.value)
// const handleClick = () => emit('change', props.ControlValue)
</script>
