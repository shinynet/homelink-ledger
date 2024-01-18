<template>
  <q-list padding>
    <q-item-label header>Devices</q-item-label>
    <q-item
      tag="label"
      v-ripple
      v-for="{location, location2, name, ref} in deviceQuery"
      :key="ref">
      <q-item-section side top>
        <q-checkbox
          v-model="selectedTokens"
          :val="ref"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{location}} {{name}}</q-item-label>
        <q-item-label caption>{{ location2 }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator spaced/>

    <q-item-label header>Admin Token</q-item-label>
    <q-item tag="label" v-ripple>
      <q-item-section side top>
        <q-checkbox v-model="selectedTokens" :val="0" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Admin</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator spaced/>

    <q-expansion-item
      icon="settings"
      label="Settings">
      <q-card>
        <q-card-section>
          <q-input
            dense
            v-model="key"
            label="License Key"/>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-item>
      <q-btn
        label="Burn"
        color="primary"
        :disabled="isFormInValid"
        style="width: 200px"
        @click="handleSubmit"/>
    </q-item>
  </q-list>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getDevices } from 'src/endpoints'
import { useMintToken } from 'src/composables/mintToken'

const { loading } = useQuasar()
const queryClient = useQueryClient()

defineOptions({ name: 'token-minting' })

const mint = useMintToken()

const { data: deviceQuery } = useQuery({
  queryFn: getDevices,
  queryKey: ['devices']
})

const selectedTokens = ref([])
const key = ref(process.env.KEY)

const isFormInValid = computed(
  () => selectedTokens.value.length === 0
)

const resetForm = () => {
  selectedTokens.value = []
  key.value = process.env.KEY
}

const invalidateQueries = async () => {
  await queryClient.invalidateQueries({ queryKey: ['devices'] })
  await queryClient.invalidateQueries({ queryKey: ['tokens'] })
}

const handleSubmit = async () => {
  loading.show()
  const devices = deviceQuery.value.filter(
    d => selectedTokens.value.includes(d.ref)
  )
  const deviceList = selectedTokens.value.includes(0)
    ? [...devices, { location: '', name: 'Admin', ref: 0 }]
    : devices

  await mint(deviceList, key, -1)
  console.log('done')

  resetForm()
  await invalidateQueries()
  loading.hide()
}
</script>
