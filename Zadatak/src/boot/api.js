import axios from 'axios'

// Frontend uvijek razgovara s Express backendom (ne s MySQL portom).
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// Headeri identiteta: ako postoji user u localStorage, šaljemo njegov id/role.
// Gost se kreira preko /api/guest i također dobije pravi users.id.
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