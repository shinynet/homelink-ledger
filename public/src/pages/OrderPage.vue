<template>
  <q-page class="row flex-center" padding>
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
        <q-form>
          <q-select label="Wallet" model-value=""/>
        </q-form>
      </q-card-section>
      <q-card-actions vertical>
        <q-btn color="primary" label="Place Order"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
defineOptions({ name: 'order-page' })
</script>
