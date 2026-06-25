import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/records')}>← 목록</Button>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => navigate(`/records/${id}/edit`)}>수정</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>삭제</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="secondary">{record.category}</Badge>
          {record.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
          {record.isPublic && (
            <Badge variant="outline" className="text-blue-500 border-blue-200">공개</Badge>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900">{record.title}</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          {new Date(record.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="prose prose-sm prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{record.content}</ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  )
}
