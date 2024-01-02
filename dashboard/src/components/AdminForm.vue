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

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query'
import { lucid } from 'boot/lucid'
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
}
</script>
