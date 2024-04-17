<template>
  <q-list separator>
    <q-item v-for="{id, title, rating, content} in testimonials" :key="id">
      <q-item-section>
        <q-item-label class="text-italic text-subtitle1">{{ title }}</q-item-label>
        <q-item-label class="text-body2 q-pa-md">{{ content }}</q-item-label>
      </q-item-section>
      <q-item-section class="gt-xs" side top>
        <div class="text-orange">
          <q-icon v-for="(_, i) in rating" :key="i" name="star"/>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
defineOptions({ name: 'testimonials-list' })

const testimonials = [
  {
    id: 1,
    title: 'Revolutionary Convenience!',
    rating: 5,
    content: 'Homelink Ledger has transformed my daily routine. With its intuitive interface and robust compatibility, I can control everything from my lights to my thermostat with a simple voice command. Plus, the blockchain technology ensures security and transparency. Highly recommended! 🏡🔒'
  },
  {
    id: 2,
    title: 'Effortless Integration',
    rating: 5,
    content: 'As a tech enthusiast, I\'ve tried various home automation systems, but Homelink Ledger stands out. The seamless integration of devices across different brands is impressive. Whether it\'s adjusting the blinds or setting up a morning routine, this system makes life easier. 🤖🏠'
  },
  {
    id: 3,
    title: 'Smart Home Bliss',
    rating: 5,
    content: 'Homelink Ledger has turned my house into a smart home paradise. The blockchain backbone ensures data security, and the user-friendly app simplifies control. I love how it adapts to my preferences and even anticipates my needs. It\'s like having a personal assistant for my home! 🌟🏡'
  },
  {
    id: 4,
    title: 'Worth Every Penny',
    rating: 5,
    content: 'Initially, I was hesitant about the price, but Homelink Ledger has exceeded my expectations. The investment is well worth it. From energy efficiency to enhanced security, it\'s a game-changer. Plus, the customer support team is responsive and helpful. Thumbs up! 💰👍'
  }
]

</script>
