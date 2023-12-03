<template>
  <q-card class="card no-box-shadow bg-grey-2">
    <q-card-section class="q-pa-none no-wrap">
      <h2 class="text-h6 q-pa-sm q-my-none text-white card-title">
        {{location}} {{name}}
        <span class="text-caption float-right">{{location2}}</span>
      </h2>
    </q-card-section>

    <q-card-section class="card-body">
      <q-img :src="icon" class="status-icon" />
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

<style lang="scss" scoped>
.card {
  height: 250px;
  width:  300px;
}
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
