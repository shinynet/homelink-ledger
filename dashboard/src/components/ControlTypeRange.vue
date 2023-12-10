<template>
  <q-slider
    :min="rangeStart"
    :max="rangeEnd"
    label
    :label-value="labelValue"
    :markers="25"
    class="slider q-px-lg"
    :model-value="value"
    @change="handleClick"/>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})
const emit = defineEmits(
  ['change']
)
const props = defineProps({
  range: {
    type: Object,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

const {
  RangeEnd: rangeEnd,
  RangeStart: rangeStart,
  RangeStatusPrefix: rangeStatusPrefix,
  RangeStatusSuffix: rangeStatusSuffix
} = props.range

const labelValue = computed(
  () => rangeStatusPrefix + props.value + rangeStatusSuffix
)

const handleClick = value => {
  emit('change', value)
}
</script>

<style scoped>
.slider {
  grid-column: span 3;
  grid-row-start: 2;
}
</style>
