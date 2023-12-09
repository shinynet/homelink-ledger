<template>
  <q-page padding>
    <h2 class="text-h6">Address</h2>
    {{ address }}
    <div v-if="isLoading">Loading address...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <div v-else-if="address">
      <h2 class="text-h6">PubKeyHash</h2>
      {{ getAddressDetails(address).paymentCredential?.hash }}
    </div>
  </q-page>
</template>

<script setup>
import { watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { lucid } from 'boot/lucid'
import { applyDoubleCborEncoding, applyParamsToScript, Constr, Data, fromText, getAddressDetails } from 'lucid-cardano'
import blueprint from '../../../aiken/plutus.json'
import metadata from '../../../aiken/sample.json'

const { data: address, error, isError, isLoading } = useQuery({
  queryFn: () => lucid.wallet.address(),
  queryKey: ['address']
})

const { data: utxos } = useQuery({
  queryKey: ['utxos'],
  queryFn: () => lucid.wallet.getUtxos()
})

watch([address, utxos], async ([newAddress, newUtxos]) => {
  if (newAddress && newUtxos) {
    const token = blueprint.validators.find((v) =>
      v.title === 'lights.token'
    )

    const owner = getAddressDetails(newAddress).paymentCredential.hash

    const parameterizedScript = applyParamsToScript(token.compiledCode,
      [owner]
    )

    const policyId = lucid.utils.validatorToScriptHash({
      type: 'PlutusV2',
      script: parameterizedScript
    })

    const tokenName = 'HomeLink Ledger'
    const assetName = `${policyId}${fromText(tokenName)}`

    const mintRedeemer = Data.to(new Constr(0, []))

    const parameterizedMintingPolicy = { type: 'PlutusV2', script: applyDoubleCborEncoding(parameterizedScript) }

    lucid
      .newTx()
      .attachMintingPolicy(parameterizedMintingPolicy)
      .mintAssets(
        { [assetName]: BigInt(1) },
        mintRedeemer
      )
      .attachMetadata(202312091500, metadata)
      .addSigner(newAddress)
      .complete()
      .then(tx => tx.sign().complete())
      .then(txSigned => txSigned.submit())
      .then(txHash => lucid.awaitTx(txHash))
      .then(success => console.log('success', success))
      .catch(err => console.log(`Transaction error occurred: ${JSON.stringify(err)}`))
  }
})
</script>
