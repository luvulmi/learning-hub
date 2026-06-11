import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { recordsApi } from '@/api/records'
import type { LearningRecord } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [record, setRecord] = useState<LearningRecord | null>(null)

  useEffect(() => {
    recordsApi.get(Number(id)).then((res) => {
      setRecord(res.data)
    }).catch(() => navigate('/records', { replace: true }))
  }, [id, navigate])

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return
    await recordsApi.delete(Number(id))
    navigate('/records', { replace: true })
  }

  if (!record) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <button onClick={() => navigate('/records')} className="text-muted-foreground hover:text-foreground">
            ← 목록으로
          </button>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate(`/records/${id}/edit`)}>수정</Button>
            <Button size="sm" variant="outline" className="text-destructive" onClick={handleDelete}>삭제</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{record.category}</Badge>
          {record.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
          {record.isPublic && <Badge variant="outline">공개</Badge>}
        </div>
        <h1 className="mb-2 text-2xl font-bold">{record.title}</h1>
        <p className="mb-8 text-xs text-muted-foreground">
          {new Date(record.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{record.content}</div>
      </main>
    </div>
  )
}
