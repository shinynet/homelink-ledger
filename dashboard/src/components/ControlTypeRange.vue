<template>
  <q-slider
    v-model="model"
    :min="rangeStart"
    :max="rangeEnd"
    label
    :label-value="labelValue"/>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

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

const model = ref(props.value)

const labelValue = computed(
  () => rangeStatusPrefix + props.value + rangeStatusSuffix
)

const handleClick = () => {
  emit('change', model.value)
}

watch(model, handleClick)
</script>
