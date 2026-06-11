import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import LoginPage from '@/pages/LoginPage'
import OAuth2CallbackPage from '@/pages/OAuth2CallbackPage'
import RecordListPage from '@/pages/RecordListPage'
import RecordFormPage from '@/pages/RecordFormPage'
import RecordDetailPage from '@/pages/RecordDetailPage'
import PublicProfilePage from '@/pages/PublicProfilePage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* 공개 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
      <Route path="/profile/:slug" element={<PublicProfilePage />} />

      {/* 인증 필요 */}
      <Route path="/records" element={<PrivateRoute><RecordListPage /></PrivateRoute>} />
      <Route path="/records/new" element={<PrivateRoute><RecordFormPage /></PrivateRoute>} />
      <Route path="/records/:id" element={<PrivateRoute><RecordDetailPage /></PrivateRoute>} />
      <Route path="/records/:id/edit" element={<PrivateRoute><RecordFormPage /></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/records" replace />} />
    </Routes>
  )
}
