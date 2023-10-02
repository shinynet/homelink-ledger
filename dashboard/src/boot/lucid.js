import { boot } from 'quasar/wrappers'
import { Lucid } from 'lucid-cardano'

const lucid = await Lucid.new()
const wallet = await window.cardano.nami.enable()

export default boot(({ app }) => {
  lucid.selectWallet(wallet)
  app.config.globalProperties.$lucid = lucid
})

export { lucid }
