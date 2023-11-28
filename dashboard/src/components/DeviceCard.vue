<template>
  <q-card class="card">
    <q-card-section>
      <div class="text-h6">{{location}} {{name}}</div>
      <div class="text-subtitle2">{{location2}}</div>
    </q-card-section>

    <q-card-section>
      {{ status }}
      <q-img
        :src="icon"
        class="icon" />
    </q-card-section>

    <q-separator />

    <q-card-actions>
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
import { computed } from 'vue'
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import { controlDeviceMutation } from 'src/endpoints'
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
  mutationFn: controlDeviceMutation,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['devices'] })
  }
})

const icon = computed(() => {
  const host = process.env.HS4_BASE_URL
  const path = props.statusImage
  const user = process.env.HS4_USER
  const pass = process.env.HS4_PASS
  return `${host}${path}?user=${user}&pass=${pass}`
})

const controlComponent = controlType => {
  if (controlType === 5) return ControlTypeBinary
  if (controlType === 7) return ControlTypeRange
  return null
}

const handleDeviceChange = value => {
  mutate({ ref: props.id, value })
}
</script>

<style scoped>
.card {
  height: 300px;
  width: 300px;
}
.icon {
  height: 50px;
  width: 50px;
}
</style>
