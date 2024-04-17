<template>
  <q-page>

    <hero-banner/>

    <div class="text-h6 text-center text-italic q-pa-xl">
      Homelink Ledger isn’t just a home automation system, it’s a lifestyle upgrade. Get ready to experience the
      future of smart living!
    </div>

    <div class="column-xs row-sm q-col-gutter-lg q-px-sm-sm">
      <div class="col-sm-6">
        <buy-now-card/>
      </div>
      <div class="col-sm-6">
        <testimonials-list/>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import TestimonialsList from 'components/TestimonialsList.vue'
import HeroBanner from 'components/HeroBanner.vue'
import BuyNowCard from 'components/BuyNowCard.vue'

defineOptions({ name: 'index-page' })
</script>
