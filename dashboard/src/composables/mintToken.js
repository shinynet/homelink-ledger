import { toValue } from 'vue'
import { lucid } from 'boot/lucid'
import { Data, fromText } from 'lucid-cardano'
import { getMintingPolicy, getPolicyId } from 'src/utils/contract'
import { getAddress } from 'src/utils/wallet'
import metadata from '../../../aiken/sample.json'

export const useMintToken = () => {
  return async (deviceList, licenseKey) => {
    const key = toValue(licenseKey)
    const devices = toValue(deviceList)

    const address = await getAddress()
    const mintingPolicy = getMintingPolicy(key)
    const policyId = getPolicyId(key)

    const assets = devices.map(d => {
      const assetName = `${policyId}${fromText(d.name)}`
      return {
        [assetName]: BigInt(d.quantity)
      }
    })

    return lucid
      .newTx()
      .attachMintingPolicy(mintingPolicy)
      .mintAssets(Object.assign({}, ...assets), Data.void())
      .attachMetadata(202312091500, metadata)
      .addSigner(address)
      .complete()
      .then(tx => tx.sign().complete())
      .then(txSigned => txSigned.submit())
      .then(txHash => lucid.awaitTx(txHash))
  }
}
