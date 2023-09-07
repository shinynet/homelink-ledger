import { boot } from 'quasar/wrappers'
import { Lucid } from 'lucid-cardano'

const lucid = await Lucid.new()

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.config.globalProperties.$lucid = lucid
})

export { lucid }
