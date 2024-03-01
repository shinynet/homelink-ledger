<template>
  <q-page class="flex flex-center column">
    <q-parallax src="hero.png">
      <template v-slot:content>
        <div class="flex flex-center q-px-xl hero-content-bg">
          <h1 class="text-accent text-weight-regular text-center text-italic hero-text">
            Protect your home with the power of blockchain
          </h1>
        </div>
      </template>
    </q-parallax>

    <q-list bordered separator style="width: 500px">
      <q-item>
        <q-item-section>
          <q-item-label class="text-italic">“Revolutionary Convenience!”</q-item-label>
          <q-item-label caption>The Homelink Ledger has transformed my daily routine. With its intuitive interface and
            robust compatibility, I can control everything from my lights to my thermostat with a simple voice
            command.
            Plus, the blockchain technology ensures security and transparency. Highly recommended! 🏡🔒
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <div class="text-orange">
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>“Effortless Integration”</q-item-label>
          <q-item-label caption>As a tech enthusiast, I’ve tried various home automation systems, but the Homelink
            Ledger stands out. The seamless integration of devices across different brands is impressive. Whether it’s
            adjusting the blinds or setting up a morning routine, this system makes life easier. 🤖🏠
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <div class="text-orange">
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>“Smart Home Bliss”</q-item-label>
          <q-item-label caption>Homelink Ledger has turned my house into a smart home paradise. The blockchain
            backbone
            ensures data security, and the user-friendly app simplifies control. I love how it adapts to my
            preferences
            and even anticipates my needs. It’s like having a personal assistant for my home! 🌟🏡
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <div class="text-orange">
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>“Worth Every Penny”</q-item-label>
          <q-item-label caption>Initially, I was hesitant about the price, but the Homelink Ledger has exceeded my
            expectations. The investment is well worth it. From energy efficiency to enhanced security, it’s a
            game-changer. Plus, the customer support team is responsive and helpful. Thumbs up! 💰👍
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <div class="text-orange">
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
            <q-icon name="star"/>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div>
      Remember, the Homelink Ledger isn’t just a home automation system; it’s a lifestyle upgrade. Get ready to
      experience the future of smart living!
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
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
