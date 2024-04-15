<template>
  <q-card bordered class="card" dark flat>
    <q-card-section class="row flex-center">
      <div class="text-h6">30% Off</div>
    </q-card-section>

    <q-card-section class="row q-gutter-md flex-center">
      <span class="text-strike text-h5">₳10</span>
      <span class="text-h3">₳7</span>
    </q-card-section>

    <q-card-actions vertical>
      <q-btn flat size="xl" to="order">Buy Now</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
defineOptions({ name: 'purchase-card' })
</script>

<style lang="scss" scoped>
.card {
  background: radial-gradient(circle, $secondary 0%, $primary 100%)
}
</style>
