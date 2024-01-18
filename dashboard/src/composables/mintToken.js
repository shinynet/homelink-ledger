import { toValue } from 'vue'
import { lucid } from 'boot/lucid'
import { applyDoubleCborEncoding, applyParamsToScript, Data, fromText } from 'lucid-cardano'
import blueprint from '../../../aiken/plutus.json'
import metadata from '../../../aiken/sample.json'

export const useMintToken = () => {
  return async (deviceList, key, amount = 1) => {
    const devices = toValue(deviceList)

    const address = await lucid.wallet.address()

    const token = blueprint.validators.find(
      v => v.title === 'lights.token'
    )

    const parameterizedScript = applyParamsToScript(
      token.compiledCode,
      [fromText(key)]
    )

    const parameterizedMintingPolicy = {
      type: 'PlutusV2',
      script: applyDoubleCborEncoding(parameterizedScript)
    }

    const policyId = lucid.utils.validatorToScriptHash({
      type: 'PlutusV2',
      script: parameterizedScript
    })

    const assets = devices.map(d => {
      const deviceName = `${d.location} ${d.name}`
      const assetName = `${policyId}${fromText(deviceName)}`
      return {
        [assetName]: BigInt(amount)
      }
    })

    lucid
      .newTx()
      .attachMintingPolicy(parameterizedMintingPolicy)
      .mintAssets(Object.assign({}, ...assets), Data.void())
      .attachMetadata(202312091500, metadata)
      .addSigner(address)
      .complete()
      .then(tx => tx.sign().complete())
      .then(txSigned => txSigned.submit())
      .then(txHash => lucid.awaitTx(txHash))
      .then(success => console.log('success', success))
      .catch(err => console.log(`Transaction error occurred: ${JSON.stringify(err)}`))
  }
}
