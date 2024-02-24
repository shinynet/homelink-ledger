import { toValue } from 'vue'
import { lucid } from 'boot/lucid'
import { useQuery } from '@tanstack/vue-query'
import { Data, fromText } from 'lucid-cardano'
import { getMintingPolicy, getPolicyId } from 'src/utils/contract'
import { getAddress } from 'src/utils/wallet'
import { getDevices } from 'src/endpoints'
import { append } from 'ramda'

export const useMintToken = () => {
  const { data: deviceQuery } = useQuery({
    queryFn: getDevices,
    queryKey: ['devices']
  })

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

    const label = 202402112000

    const allDevices = append({ name: 'Admin' }, toValue(deviceQuery))
    const assetObjs = allDevices.map(d => {
      const hexName = fromText(d.name)
      return {
        [hexName]: {
          name: d.name,
          image: 'https://batch-73.s3.us-west-1.amazonaws.com/Snuggle.png'
        }
      }
    })

    const metadata = {
      [policyId]: Object.assign({}, ...assetObjs)
    }

    return lucid
      .newTx()
      .attachMintingPolicy(mintingPolicy)
      .mintAssets(Object.assign({}, ...assets), Data.void())
      .attachMetadata(label, metadata)
      .addSigner(address)
      .complete()
      .then(tx => tx.sign().complete())
      .then(txSigned => txSigned.submit())
      .then(txHash => lucid.awaitTx(txHash))
  }
}
