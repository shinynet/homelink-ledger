import { toValue } from 'vue'
import { lucid } from 'boot/lucid'
import { Data, fromText } from 'lucid-cardano'
import { getMintingPolicy, getPolicyId } from 'src/utils/contract'
import { getAddress } from 'src/utils/wallet'
import metadata from '../../../aiken/sample.json'

export const useMintToken = () => {
  return async (deviceList, licenseKey, amount = 1) => {
    const key = toValue(licenseKey)
    const devices = toValue(deviceList)

    const address = await getAddress()
    const mintingPolicy = getMintingPolicy(key)
    const policyId = getPolicyId(key)

    const assets = devices.map(d => {
      const deviceName = `${d.location} ${d.name}`
      const assetName = `${policyId}${fromText(deviceName)}`
      return {
        [assetName]: BigInt(amount)
      }
    })

    lucid
      .newTx()
      .attachMintingPolicy(mintingPolicy)
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
