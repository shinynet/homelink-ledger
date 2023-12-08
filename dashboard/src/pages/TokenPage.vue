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
    // console.log('newAddress', newAddress)
    // console.log('newUtxos', newUtxos)

    const token = blueprint.validators.find((v) =>
      v.title === 'lights.token'
    )
    // console.log('blueprint', blueprint)
    // console.log('token', token)

    const tokenName = 'HomeLink Ledger'
    // console.log('tokenName', tokenName)

    const owner = getAddressDetails(newAddress).paymentCredential.hash
    // console.log('owner', owner)

    const giftCard = applyParamsToScript(token.compiledCode,
      [owner]
    )
    // console.log('giftCard', giftCard)

    const policyId = lucid.utils.validatorToScriptHash({
      type: 'PlutusV2',
      script: giftCard
    })
    // console.log('policyId', policyId)

    const assetName = `${policyId}${fromText(tokenName)}`
    // console.log('assetName', assetName)

    const mintRedeemer = Data.to(new Constr(0, []))
    // console.log('mintRedeemer', mintRedeemer)

    const parameterizedGiftCard = { type: 'PlutusV2', script: applyDoubleCborEncoding(giftCard) }
    // console.log('parameterizedGiftCard', parameterizedGiftCard)

    const tx = await lucid
      .newTx()
      .attachMintingPolicy(parameterizedGiftCard)
      .mintAssets(
        { [assetName]: BigInt(1) },
        mintRedeemer
      )
      .addSigner(newAddress)
      .complete()

    console.log('tx', tx)

    const txSigned = await tx.sign().complete()
    console.log('txSigned', txSigned)

    const txHash = await txSigned.submit()
    console.log('txHash', txHash)

    const success = await lucid.awaitTx(txHash)
    console.log('success', success)
  }
})
</script>
