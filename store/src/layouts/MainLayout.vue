<template>
  <q-layout view="lHh Lpr lff">

    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          <router-link :to="{name: 'Home'}">
            <img alt="Logo" src="logo.png" style="width: 180px; height: 75px"/>
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer class="bg-grey-3 text-dark">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat>Terms & Service</q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
defineOptions({ name: 'main-layout' })
</script>
