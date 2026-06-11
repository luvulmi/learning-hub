import { create } from 'zustand'
import apiClient from '@/api/client'

interface AuthState {
  token: string | null
  profileSlug: string | null
  setToken: (token: string) => void
  fetchMe: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  profileSlug: localStorage.getItem('profileSlug'),
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  fetchMe: async () => {
    const res = await apiClient.get<{ profileSlug: string }>('/users/me')
    localStorage.setItem('profileSlug', res.data.profileSlug)
    set({ profileSlug: res.data.profileSlug })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('profileSlug')
    set({ token: null, profileSlug: null })
  },
}))
