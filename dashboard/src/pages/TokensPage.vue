<template>
  <q-page padding>

      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator>
        <q-route-tab name="mails" label="Mint Tokens" to="/tokens/mint" />
        <q-route-tab name="alarms" label="Burn Tokens" to="/tokens/burn" />
      </q-tabs>

    <router-view />

    <q-banner v-if="isError" class="error-banner text-white bg-red">
      {{error.message}}
    </q-banner>
    <div v-if="isAdmin && utxos">
      <h3>Create admin nft</h3>
      <admin-form :address=address :pkh=pkh :utxos=utxos />
    </div>
    <div v-if="isAdmin">
      <lights-form :address=address :pkh=pkh />
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { lucid } from 'boot/lucid'
import { applyParamsToScript, fromText, fromUnit, getAddressDetails } from 'lucid-cardano'
import AdminForm from 'components/AdminForm.vue'
import LightsForm from 'components/LightsForm.vue'
import blueprint from '../../../aiken/plutus.json'
import { getWalletAddress, getWalletUtxos } from 'src/endpoints'

defineOptions({ name: 'tokens-page' })

const { data: address, error, isError } = useQuery({
  queryFn: getWalletAddress,
  queryKey: ['address']
})

const { data: utxos } = useQuery({
  queryKey: ['utxos'],
  queryFn: () => getWalletUtxos()
})

const tab = ref()

const pkh = ref('')
const nftParams = ref([])

const token = blueprint.validators.find((v) =>
  v.title === 'lights.token'
)

const nft = blueprint.validators.find((v) =>
  v.title === 'admin.token'
)

const getPolicyId = (token, params) => {
  const parameterizedScript = applyParamsToScript(token.compiledCode, params)

  return lucid.utils.validatorToScriptHash({
    type: 'PlutusV2',
    script: parameterizedScript
  })
}

watch([address, utxos], ([newAddress, newUtxos]) => {
  // console.log('address', address)
  // console.log('newAddress', newAddress)

  if (newAddress && newUtxos) {
    pkh.value = getAddressDetails(newAddress).paymentCredential.hash
    nftParams.value = [
      pkh.value,
      '94b2e5b0e8c749104cd58ca775f0df6950fbc431f7dab415471f532c3c8abe4a', // we'll have to figure out how to retrieve the txHash
      BigInt(0), // we'll have to figure out how to retrieve the output index
      fromText('HomeLink Ledger Admin')
    ]

    const tokenPolicyId = getPolicyId(token, [pkh.value])
    const nftPolicyId = getPolicyId(nft, nftParams.value)

    console.log('devices token policy id', tokenPolicyId)
    console.log('admin nft policy id', nftPolicyId)

    const adminPolicyMatches = newUtxos.flatMap((utxo) =>
      Object.entries(utxo.assets).map(([key]) => {
        if (key === 'lovelace') {
          return false
        } else {
          const { policyId } = fromUnit(key)
          return policyId === nftPolicyId
        }
      })
    )

    const devicePolicyMatches = newUtxos.flatMap((utxo) =>
      Object.entries(utxo.assets).map(([key]) => {
        if (key === 'lovelace') {
          return false
        } else {
          const { policyId } = fromUnit(key)
          return policyId === tokenPolicyId
        }
      })
    )

    console.log('wallet contains admin nft', adminPolicyMatches.includes(true))
    console.log('wallet contains device token(s)', devicePolicyMatches.includes(true))

    // console.log('policyIdMatches', policyIdMatches)
  }
}, { immediate: true })

const isAdmin = computed(() => pkh.value === process.env.PKH)

</script>
