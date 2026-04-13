import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('auth-store')
    if (stored) {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'

    if (error.response?.status === 401) {
      // Clear auth and redirect
      localStorage.removeItem('auth-store')
      window.location.href = '/login'
    } else if (error.response?.status !== 404) {
      // Don't toast 404s (handled locally)
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
