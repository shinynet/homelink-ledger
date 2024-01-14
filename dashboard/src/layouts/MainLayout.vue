<template>
  <q-layout view="lHh Lpr lFf">
    <LayoutHeader @toggle="handleToggleDrawer"/>
    <LayoutDrawer
      :drawer-open="drawerOpen"
      @hide="handleDrawerHide"/>
    <q-page-container>
      <router-view />
    </q-page-container>
    <layout-footer/>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import LayoutFooter from 'layouts/mainLayout/LayoutFooter.vue'
import LayoutDrawer from 'layouts/mainLayout/LayoutDrawer.vue'
import LayoutHeader from 'layouts/mainLayout/LayoutHeader.vue'

const drawerOpen = ref(false)

const handleToggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const handleDrawerHide = () => {
  drawerOpen.value = false
}
</script>
