import { boot } from 'quasar/wrappers'
import { VueQueryPlugin } from '@tanstack/vue-query'

// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.use(VueQueryPlugin)
})
