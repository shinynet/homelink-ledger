<template>
  <q-card bordered flat square style="width: 400px">

    <q-card-section>
      <q-list dense>
        <q-item>
          <q-item-section>Homelink Ledger:</q-item-section>
          <q-item-section side>₳10</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Discounts:</q-item-section>
          <q-item-section side>₳3</q-item-section>
        </q-item>
        <q-item active>
          <q-item-section>Total:</q-item-section>
          <q-item-section side>₳7</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section>
      <q-select
        v-model="model"
        :options="wallets"
        label="Wallet"
        option-label="name">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <img
                :src="scope.opt.icon"
                alt="wallet icon"
                class="wallet-icon"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:prepend>
          <img
            v-if="model"
            :src="model.icon"
            alt="wallet icon"
            class="wallet-icon"/>
        </template>
      </q-select>
    </q-card-section>

    <q-card-actions vertical>
      <q-btn
        :disable="model === undefined"
        color="primary"
        label="Place Order"
        @click="emit('placeOrder')"/>
    </q-card-actions>

    <q-inner-loading
      :showing="showLoading"
      label="Processing Order..."
      label-class="text-teal"
      label-style="font-size: 1.1em"/>
  </q-card>
</template>

<script setup>
defineOptions({ name: 'order-card' })

defineProps({
  wallets: { type: Array, required: true },
  showLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['placeOrder'])

const model = defineModel()
</script>

<style lang="scss" scoped>
.wallet-icon {
  height: 45px;
  width: 45px;
}
</style>
