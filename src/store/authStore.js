import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/login', { email, password })
        set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return data
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/register', { name, email, password })
        set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return data
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        delete api.defaults.headers.common['Authorization']
      },

      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),

      initAuth: () => {
        const { token } = get()
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      },

      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export default useAuthStore
