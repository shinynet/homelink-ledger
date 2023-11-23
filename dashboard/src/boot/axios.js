import { boot } from 'quasar/wrappers'
import axios from 'axios'
const api = axios.create({
  baseURL: process.env.HS4_BASE_URL,
  params: {
    user: process.env.HS4_USER,
    pass: process.env.HS4_PASS
  }
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
