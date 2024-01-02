<template>
  <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      {{ pkh }}
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
import { applyDoubleCborEncoding, applyParamsToScript, Constr, Data, fromText, fromUnit, getAddressDetails, toText } from 'lucid-cardano'
import blueprint from '../../../aiken/plutus.json'

const props = defineProps({
  pkh: {
    type: String,
    required: true
  }
})

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
  console.log('tokenName.value', tokenName.value)
  console.log('utxo.value', utxo.value)
  console.log('props.pkh', props.pkh)

  const nft = blueprint.validators.find((v) =>
    v.title === 'admin.token'
  )

  const pkh = getAddressDetails(props.pkh).paymentCredential?.hash
  console.log('pkh', pkh)

  const parameterizedScript = applyParamsToScript(nft.compiledCode,
    [pkh, utxo.value.txHash, BigInt(utxo.value.outputIndex), fromText(tokenName.value)]
  )

  const parameterizedMintingPolicy = { type: 'PlutusV2', script: applyDoubleCborEncoding(parameterizedScript) }

  const policyId = lucid.utils.validatorToScriptHash({
    type: 'PlutusV2',
    script: parameterizedScript
  })

  console.log('policyId', policyId)
  const assetName = `${policyId}${fromText(tokenName.value)}`

  const mintRedeemer = Data.to(new Constr(0, []))

  console.log('parameterizedMintingPolicy', parameterizedMintingPolicy)
  console.log('assetName', assetName)
  console.log('mintRedeemer', mintRedeemer)

  lucid
    .newTx()
    .attachMintingPolicy(parameterizedMintingPolicy)
    .mintAssets(
      { [assetName]: BigInt(1) },
      mintRedeemer
    )
    // .attachMetadata(202312091500, metadata)
    .addSigner(props.pkh)
    .complete()
    .then(tx => tx.sign().complete())
    .then(txSigned => txSigned.submit())
    .then(txHash => lucid.awaitTx(txHash))
    .then(success => console.log('success', success))
    .catch(err => console.log(`Transaction error occurred: ${JSON.stringify(err)}`))
    // .catch(err => console.log(`Transaction error occurred: ${err}`))

  // for (const asset in utxo.value.assets) {
  //   if (asset !== 'lovelace') {
  //     // const { assetName, label, name } = fromUnit(asset)
  //     const { assetName } = fromUnit(asset)
  //     // console.log(assetName)
  //     console.log(toText(assetName))
  //   }
  //   // console.log('asset', asset)
  //   // console.log(fromUnit(asset))
  // }

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
