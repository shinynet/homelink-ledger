<template>
  <h3>{{ actionText }} device token</h3>
  <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
    <div>
      <q-input
        filled
        v-model="tokenName"
        label="Token name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
    </div>
    <div>
      <q-toggle
        v-model="action"
        checked-icon="local_fire_department"
        color="red"
        label="Burn token"
        unchecked-icon="token"
      />
    </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>
</template>

<script setup>
import { lucid } from 'boot/lucid'
import { computed, ref } from 'vue'
import { applyDoubleCborEncoding, applyParamsToScript, Constr, Data, fromText } from 'lucid-cardano'
import blueprint from '../../../aiken/plutus.json'
import metadata from '../../../aiken/sample.json'

const props = defineProps({
  address: {
    type: String,
    required: true
  },
  pkh: {
    type: String,
    required: true
  }
})

const tokenName = ref(null)
const action = ref(false)

const actionText = computed(() => action.value === false ? 'Mint' : 'Burn')
const amount = computed(() => action.value === false ? 1 : (-1))

const onSubmit = () => {
  console.log('onSubmit called')
  console.log('tokenName.value', tokenName.value)
  console.log('props.address', props.address)
  console.log('action.value', action.value)

  const token = blueprint.validators.find((v) =>
    v.title === 'lights.token'
  )

  console.log('props.pkh', props.pkh)

  const parameterizedScript = applyParamsToScript(token.compiledCode,
    [props.pkh]
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
      { [assetName]: BigInt(amount) },
      mintRedeemer
    )
    .attachMetadata(202312091500, metadata)
    .addSigner(props.address)
    .complete()
    .then(tx => tx.sign().complete())
    .then(txSigned => txSigned.submit())
    .then(txHash => lucid.awaitTx(txHash))
    .then(success => console.log('success', success))
    .catch(err => console.log(`Transaction error occurred: ${JSON.stringify(err)}`))
}
</script>
