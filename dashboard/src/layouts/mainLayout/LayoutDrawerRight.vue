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
          v-for="{assetName, unit, quantity} in tokens"
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
import { useQuery } from '@tanstack/vue-query'
import { getTokens } from 'src/endpoints'

const { data: tokens } = useQuery({
  queryFn: getTokens,
  queryKey: ['tokens']
})

defineOptions({ name: 'layout-drawer-right' })

</script>
