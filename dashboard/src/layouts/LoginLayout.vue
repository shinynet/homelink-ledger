<template>
  <q-layout>

    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-img src="logo.png" style="width: 180px; height: 75px"/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
