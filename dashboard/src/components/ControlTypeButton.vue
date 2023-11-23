<template>
  <q-btn
    flat
    v-if="ControlType === 5"
    @click="handleClick">
    {{Label}}
  </q-btn>
</template>

<script setup>
const emit = defineEmits(['change'])

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
  }
})

const handleClick = () => emit('change', props.ControlValue)
</script>
