<template>
  <q-card class="no-box-shadow bg-grey-2">
    <q-card-section class="q-pa-none no-wrap">
      <h2 class="text-h6 q-pa-sm q-my-none text-white card-title">
        {{location}} {{name}}
        <span class="text-caption float-right">{{location2}}</span>
      </h2>
    </q-card-section>

    <q-card-section class="card-body">
      <q-img :src="deviceStatusImage" class="status-icon" />
      <caption class="text-uppercase text-accent text-weight-bolder text-subtitle1">
        {{ status }}
      </caption>
    </q-card-section>

    <q-separator inset />

    <q-card-actions class="card-actions">
      <component
        v-for="{
          CCIndex: ccIndex,
          ControlType: controlType,
          ControlValue: controlValue,
          Label: label,
          Range: range
        } in controlPairs"
        :key="ccIndex"
        :is="controlComponent(controlType)"
        :control-value="controlValue"
        :label="label"
        :range="range"
        :value="value"
        @change="handleDeviceChange"/>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { api } from 'boot/axios'
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import { updateDevice } from 'src/endpoints'
import ControlTypeBinary from 'components/ControlTypeBinary.vue'
import ControlTypeRange from 'components/ControlTypeRange.vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  controlPairs: {
    type: Array,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  location2: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  statusImage: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

const queryClient = useQueryClient()
const { mutate } = useMutation({
  mutationFn: updateDevice,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['devices'] })
  }
})

const controlComponent = controlType => {
  if (controlType === 5) return ControlTypeBinary
  if (controlType === 7) return ControlTypeRange
  return null
}

const deviceStatusImage = ref()

watch(() => props.statusImage, path => {
  api.get('/status-image', {
    params: { path }
  }).then(({ data }) => {
    deviceStatusImage.value = data
  })
}, { immediate: true })

const handleDeviceChange = value => {
  mutate({ ref: props.id, value })
}
</script>

<style lang="scss" scoped>
.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-x-base;
}
.card-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  grid-auto-flow: row;
}
.card-title {
  background: linear-gradient(90deg, $primary 0%, $secondary 100%);
}
.status-icon {
  height: 50px;
  width: 50px;
}
</style>
