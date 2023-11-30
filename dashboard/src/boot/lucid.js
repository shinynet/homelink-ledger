import { boot } from 'quasar/wrappers'
import { Lucid } from 'lucid-cardano'

const lucid = await Lucid.new()

export default boot(({ app }) => {
  app.config.globalProperties.$lucid = lucid
})

export { lucid }
