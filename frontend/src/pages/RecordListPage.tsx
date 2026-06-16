import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { recordsApi } from '@/api/records'
import { useAuthStore } from '@/store/authStore'
import type { LearningRecord } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">Learning Hub</h1>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate('/records/new')}>+ 새 기록</Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/recommendations')}>
              AI 추천
            </Button>
            {profileSlug && (
              <Button size="sm" variant="outline" onClick={() => navigate(`/profile/${profileSlug}`)}>
                내 프로필
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => { logout(); navigate('/login') }}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {records.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">아직 기록이 없습니다.</p>
            <Button onClick={() => navigate('/records/new')}>첫 학습 기록 작성하기</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/records/${record.id}`} className="hover:underline">
                      <CardTitle className="text-base">{record.title}</CardTitle>
                    </Link>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/records/${record.id}/edit`)}>수정</Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(record.id)}>삭제</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="secondary">{record.category}</Badge>
                    {record.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{record.content}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(record.createdAt).toLocaleDateString('ko-KR')}</span>
                    {record.isPublic && <Badge variant="outline" className="text-xs">공개</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
