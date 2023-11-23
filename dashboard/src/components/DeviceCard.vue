<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{location}} {{name}}</div>
      <div class="text-subtitle2">{{location2}}</div>
    </q-card-section>

    <q-card-section>
      {{ status }}
      <q-img
        :src="statusImage"
        class="status-image" />
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <component
        v-for="controlPair in ControlPairs"
        :key="controlPair.CCIndex"
        :is="controlPair.ControlType === 5 ? ControlTypeBinary : ControlTypeRange"
        v-bind="controlPair"
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
  ControlPairs: {
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
  status_image: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

const statusImage = computed(() => {
  const host = process.env.HS4_BASE_URL
  const path = props.status_image
  const user = process.env.HS4_USER
  const pass = process.env.HS4_PASS

  return `${host}${path}?user=${user}&pass=${pass}`
})

const queryClient = useQueryClient()

const { mutate: mutateDevice } = useMutation({
  mutationFn: controlDeviceMutation,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['devices'] })
  }
})

const handleDeviceChange = value => {
  mutateDevice({ ref: props.id, value })
}
</script>

<style scoped>
.status-image {
  height: 50px;
  width: 50px;
}
</style>
