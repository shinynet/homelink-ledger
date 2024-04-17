<template>
  <q-parallax :height="740" src="hero.png">
    <template v-slot:content>
      <div class="q-px-xl hero-content-bg">
        <h1 class="text-accent text-weight-regular text-center text-italic hero-text text-h2">
          Protect your home with the power of blockchain
        </h1>
      </div>
    </template>
  </q-parallax>
</template>

<script setup>
defineOptions({ name: 'hero-banner' })
</script>

<style lang="scss" scoped>
.hero-content-bg {
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.75),
      rgba(255, 255, 255, 0)
  )
}

.hero-text {
  text-shadow: -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF
}
</style>
