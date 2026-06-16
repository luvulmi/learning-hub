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
    title: '', content: '', category: 'ETC', tags: [], isPublic: false,
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
      setForm((p) => ({ ...p, tags: [...p.tags, tag] }))
    }
    setTagInput('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) await recordsApi.update(Number(id), form)
      else await recordsApi.create(form)
      navigate('/records')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>← 뒤로</Button>
          <h1 className="text-sm font-semibold text-slate-900">
            {isEdit ? '기록 수정' : '새 학습 기록'}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">제목</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              placeholder="학습한 내용을 간단히 적어주세요"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">카테고리</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">태그</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                placeholder="태그 입력 후 Enter"
              />
              <Button type="button" variant="outline" onClick={addTag}>추가</Button>
            </div>
            {form.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {tag}
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))}
                      className="ml-0.5 text-slate-400 transition hover:text-slate-700"
                    >×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">내용</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={12}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              placeholder="학습 내용을 자세히 적어주세요"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 accent-slate-800"
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
