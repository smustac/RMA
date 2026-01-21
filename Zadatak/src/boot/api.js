import axios from 'axios'

// frontend uvijek razgovara s express backendom 
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api'
})


// gost se kreira preko /api/guest i također dobije pravi users.id.
api.interceptors.request.use(config => {
  const userRaw = localStorage.getItem('user')
  const user = userRaw ? JSON.parse(userRaw) : null

  if (user && user.id) {
    config.headers['x-user-id'] = user.id
    config.headers['x-user-role'] = user.role || 'student'
  }

  return config
})

export { api }