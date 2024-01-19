<template>
  <q-drawer
    :model-value="true"
    side="right"
    :mini="true"
    bordered>
    <q-scroll-area
      class="fit"
      :horizontal-thumb-style="{ opacity: 0 }">
      <q-list padding>
        <q-item
          v-for="{assetName, unit, quantity} in assets"
          :key="unit"
          dense>
          <q-btn
            class="full-width"
            dense
            icon="token"
            :label="assetName"
            stack
            flat
            size="sm">
            <q-badge floating transparent color="accent">{{quantity}}</q-badge>
          </q-btn>
        </q-item>
      </q-list>

    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPolicyIdAssets } from 'src/utils/wallet'
import { getPolicyId } from 'src/utils/contract'

const assets = ref([])

defineOptions({ name: 'layout-drawer-right' })

onMounted(
  () => getPolicyIdAssets(getPolicyId(process.env.KEY))
    .then(result => {
      assets.value = result
    })
)
</script>
