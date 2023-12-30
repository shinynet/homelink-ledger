<template>
  <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="tokenName"
        label="Token name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <div v-if="isLoadingUTxOs">Loading address...</div>
      <q-select
        v-else-if="utxos"
        filled
        bg-color="white"
        v-model="utxo"
        :options="utxos"
        label="Payment UTxO"
        class="select"
        :option-label="(item) => getLabel(item)"
        :option-value="(item) => item" />
        <!-- :option-label="(item) => `${item.txHash} ${item.outputIndex}`" -->
        <!-- option-label="txHash" -->
        <!-- dense -->
        <!-- emit-value -->
      <!-- <q-input
        filled
        type="number"
        v-model="age"
        label="Your age *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your age',
          val => val > 0 && val < 100 || 'Please type a real age'
        ]"
      /> -->

      <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query'
import { lucid } from 'boot/lucid'
// import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { fromUnit, toText } from 'lucid-cardano'
// import { fromUnit } from 'lucid-cardano'

const { data: utxos, /* error, isError, */ isLoading: isLoadingUTxOs } = useQuery({
  queryKey: ['utxos'],
  queryFn: () => lucid.wallet.getUtxos()
})

// const $q = useQuasar()

const tokenName = ref(null)
const utxo = ref(null)

const getLabel = (utxo) => {
  return [...Object.entries(utxo.assets).map(([key, value]) => {
    if (key === 'lovelace') {
      // console.log(`${value} ${key}`)
      return [`${value} ${key}`]
    } else {
      const { assetName } = fromUnit(key)
      // console.log(`${value} ${toText(assetName)}`)
      return [`${value} ${toText(assetName)}`]
    }
  })]
}

const onSubmit = () => {
  console.log('onSubmit called')
  console.log('tokenName', tokenName.value)
  console.log('utxo', utxo.value)

  for (const asset in utxo.value.assets) {
    if (asset !== 'lovelace') {
      // const { assetName, label, name } = fromUnit(asset)
      const { assetName } = fromUnit(asset)
      // console.log(assetName)
      console.log(toText(assetName))
    }
    // console.log('asset', asset)
    // console.log(fromUnit(asset))
  }

  // console.log('****', fromUnit(utxo.value.assets))
  // if (accept.value !== true) {
  //   $q.notify({
  //     color: 'red-5',
  //     textColor: 'white',
  //     icon: 'warning',
  //     message: 'You need to accept the license and terms first'
  //   })
  // }
  // else {
  // $q.notify({
  //   color: 'green-4',
  //   textColor: 'white',
  //   icon: 'cloud_done',
  //   message: 'Submitted'
  // })
  // }
}

// const onReset = () => {
//   tokenName.value = null
//   age.value = null
//   accept.value = false
// }
</script>
