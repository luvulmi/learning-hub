import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { recordsApi } from '@/api/records'
import { useAuthStore } from '@/store/authStore'
import type { LearningRecord } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function RecordListPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const profileSlug = useAuthStore((s) => s.profileSlug)
  const [records, setRecords] = useState<LearningRecord[]>([])

  useEffect(() => {
    recordsApi.list().then((res) => setRecords(res.data.content))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    await recordsApi.delete(id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <span className="text-sm font-bold tracking-tight text-slate-900">📚 Learning Hub</span>
          <nav className="flex items-center gap-0.5">
            <Button variant="ghost" size="sm" onClick={() => navigate('/recommendations')}>AI 추천</Button>
            {profileSlug && (
              <Button variant="ghost" size="sm" onClick={() => navigate(`/profile/${profileSlug}`)}>내 프로필</Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/login') }} className="text-slate-400 mr-2">
              로그아웃
            </Button>
            <Button size="sm" onClick={() => navigate('/records/new')}>
              + 새 기록
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {records.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-4 text-5xl">✍️</div>
            <p className="mb-6 text-slate-500">아직 학습 기록이 없습니다</p>
            <Button onClick={() => navigate('/records/new')}>첫 학습 기록 작성하기</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/records/${record.id}`} className="flex-1 min-w-0">
                    <h2 className="truncate font-semibold text-slate-900 group-hover:text-blue-600 transition">
                      {record.title}
                    </h2>
                  </Link>
                  <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/records/${record.id}/edit`)}>
                      수정
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
                      삭제
                    </Button>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">{record.category}</Badge>
                  {record.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                  {record.isPublic && (
                    <Badge variant="outline" className="text-xs text-blue-500 border-blue-200">공개</Badge>
                  )}
                </div>

                <p className="mt-2.5 line-clamp-2 text-sm text-slate-500">{record.content}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(record.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
