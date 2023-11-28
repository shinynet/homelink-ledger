<template>
  <q-btn flat @click="handleClick">
    {{label}}
  </q-btn>
</template>

<script setup>
defineOptions({
  inheritAttrs: false
})
const emit = defineEmits(
  ['change']
)
const props = defineProps({
  controlValue: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const handleClick = () => {
  emit('change', props.controlValue)
}
</script>
