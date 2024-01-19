<template>
  <q-drawer
    :model-value="drawerOpen"
    show-if-above
    bordered
    class="bg-grey-2"
    @hide="handleHide">
    <q-list>
      <q-item-label header>
        Navigation
      </q-item-label>

      <EssentialLink
        v-for="link in navigation"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-drawer>
</template>

<script setup>
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({ name: 'layout-drawer' })

defineProps({
  drawerOpen: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['hide'])

const navigation = [
  {
    title: 'Dashboard',
    icon: 'grid_view',
    link: '/'
  },
  {
    title: 'Mint / Burn Tokens',
    icon: 'token',
    link: '/tokens/mint'
  }
]

const handleHide = () => {
  emit('hide')
}
</script>
