import { boot } from 'quasar/wrappers'
import { Blockfrost, Lucid } from 'lucid-cardano'

const lucid = await Lucid.new(
  new Blockfrost(
    'https://cardano-preview.blockfrost.io/api/v0',
    'previewV8gEpWkh8Mdd7O2PHTVLkgm9l89o8anf'
  ),
  'Preview'
)

lucid.selectWallet(
  await window.cardano.nami.enable()
)

export default boot(({ app }) => {
  app.config.globalProperties.$lucid = lucid
})

export { lucid }
