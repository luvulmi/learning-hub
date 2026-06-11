import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function OAuth2CallbackPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)
  const fetchMe = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      setToken(token)
      fetchMe().finally(() => navigate('/records', { replace: true }))
    } else {
      navigate('/login', { replace: true })
    }
  }, [navigate, setToken, fetchMe])

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">로그인 처리 중...</p>
    </div>
  )
}
