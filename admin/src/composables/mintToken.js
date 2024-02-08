import { toValue } from 'vue'
import { lucid } from 'boot/lucid'
import { Data, fromText } from 'lucid-cardano'
import { getMintingPolicy, getPolicyId } from 'src/utils/contract'
import metadata from '../../../aiken/sample.json'

export const useMintToken = () => {
  return async licenseKey => {
    const key = toValue(licenseKey)

    const address = await lucid.wallet.address()
    const mintingPolicy = getMintingPolicy(key)
    const policyId = getPolicyId(key)

    const assetName = `${policyId}${fromText('Admin')}`
    const asset = { [assetName]: BigInt(1) }

    console.log('asset: ', asset)

    return lucid
      .newTx()
      .attachMintingPolicy(mintingPolicy)
      .mintAssets(Object.assign({}, asset), Data.void())
      .attachMetadata(202312091500, metadata)
      .addSigner(address)
      .complete()
      .then(tx => tx.sign().complete())
      .then(txSigned => txSigned.submit())
      .then(txHash => lucid.awaitTx(txHash))
  }
}
