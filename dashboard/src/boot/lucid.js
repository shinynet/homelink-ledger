import { boot } from 'quasar/wrappers'
import { Blockfrost, Lucid } from 'lucid-cardano'

const lucid = await Lucid.new(
  new Blockfrost(
    'https://cardano-preview.blockfrost.io/api/v0',
    process.env.BLOCKFROST_API_KEY
  ),
  'Preview'
)

export default boot(({ app }) => {
  app.config.globalProperties.$lucid = lucid
})

export { lucid }
