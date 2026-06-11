import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { recordsApi, type RecordRequest } from '@/api/records'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['ALGORITHM', 'DATA_STRUCTURE', 'SYSTEM_DESIGN', 'LANGUAGE', 'FRAMEWORK', 'DATABASE', 'DEVOPS', 'ETC']

export default function RecordFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState<RecordRequest>({
    title: '',
    content: '',
    category: 'ETC',
    tags: [],
    isPublic: false,
  })
  const [tagInput, setTagInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    recordsApi.get(Number(id)).then((res) => {
      const { title, content, category, tags, isPublic } = res.data
      setForm({ title, content, category, tags, isPublic })
    })
  }, [id, isEdit])

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) {
        await recordsApi.update(Number(id), form)
      } else {
        await recordsApi.create(form)
      }
      navigate('/records')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">←</button>
          <h1 className="text-lg font-semibold">{isEdit ? '기록 수정' : '새 학습 기록'}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">제목</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="학습한 내용을 간단히 적어주세요"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">카테고리</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">태그</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="태그 입력 후 Enter"
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>추가</Button>
            </div>
            {form.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">내용</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={10}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="학습 내용을 자세히 적어주세요"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
              className="h-4 w-4 rounded border"
            />
            공개 프로필에 표시
          </label>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? '저장 중...' : isEdit ? '수정 완료' : '기록 저장'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>취소</Button>
          </div>
        </form>
      </main>
    </div>
  )
}
