import { boot } from 'quasar/wrappers'

// Vue-Query wants to serialize results to JSON by default.
// The getUtxos() result contains BigInts (asset values)
// which aren't serializable by default. So, we have to tell
// BigInt how we want them to serialize to JSON

export default boot(() => {
  // eslint-disable-next-line no-extend-native
  BigInt.prototype.toJSON = function () {
    return this.toLocaleString()
  }
})
