import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Create an Axios instance with your backend URL
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Express backend URL
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach identity headers from localStorage for backend auth middleware.
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('user')
  if (raw) {
    try {
      const user = JSON.parse(raw)
      if (user?.id) {
        config.headers['x-user-id'] = user.id
        config.headers['x-user-role'] = user.role || 'student'
      }
    } catch {
      // ignore parse errors
    }
  }
  return config
})

export default boot(({ app }) => {
  // Make axios and api available globally via this.$axios / this.$api
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
