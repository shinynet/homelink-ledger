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

      <q-select
        filled
        bg-color="white"
        v-model="utxo"
        :options="props.utxos"
        label="Payment UTxO"
        class="select"
        :option-label="(item) => getLabel(item)"
        :option-value="(item) => item" />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>
</template>

<script setup>
import { lucid } from 'boot/lucid'
import { ref } from 'vue'
import { applyDoubleCborEncoding, applyParamsToScript, Constr, Data, fromText, fromUnit, toText } from 'lucid-cardano'
import blueprint from '../../../aiken/plutus.json'

const props = defineProps({
  address: {
    type: String,
    required: true
  },
  pkh: {
    type: String,
    required: true
  },
  utxos: {
    type: Array,
    required: true
  }
})

const tokenName = ref(null)
const utxo = ref(null)

const getLabel = (utxo) => {
  return [...Object.entries(utxo.assets).map(([key, value]) => {
    if (key === 'lovelace') {
      return [`${value} ${key}`]
    } else {
      const { assetName } = fromUnit(key)
      return [`${value} ${toText(assetName)}`]
    }
  })]
}

const onSubmit = () => {
  console.log('onSubmit called')
  console.log('tokenName.value', tokenName.value)
  console.log('utxo.value', utxo.value)
  console.log('props.address', props.address)

  const nft = blueprint.validators.find((v) =>
    v.title === 'admin.token'
  )

  console.log('props.pkh', props.pkh)

  const parameterizedScript = applyParamsToScript(nft.compiledCode,
    [props.pkh, utxo.value.txHash, BigInt(utxo.value.outputIndex), fromText(tokenName.value)]
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
    .addSigner(props.address)
    .complete()
    .then(tx => tx.sign().complete())
    .then(txSigned => txSigned.submit())
    .then(txHash => lucid.awaitTx(txHash))
    .then(success => console.log('success', success))
    .catch(err => console.log(`Transaction error occurred: ${JSON.stringify(err)}`))
}
</script>