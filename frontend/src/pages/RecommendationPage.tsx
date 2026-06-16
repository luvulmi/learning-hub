import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recommendationsApi, type Recommendation } from '@/api/recommendations'
import { Button } from '@/components/ui/button'

export default function RecommendationPage() {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    recommendationsApi.list().then((res) => setRecommendations(res.data))
  }, [])

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await recommendationsApi.create()
      setRecommendations((prev) => [res.data, ...prev])
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id: number) => {
    const res = await recommendationsApi.accept(id)
    setRecommendations((prev) => prev.map((r) => (r.id === id ? res.data : r)))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/records')}>← 학습 기록</Button>
          <span className="text-sm font-semibold text-slate-900">AI 추천</span>
          <Button size="sm" onClick={handleCreate} disabled={loading}>
            {loading ? '분석 중...' : '새 추천 받기'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-4 text-5xl">🤖</div>
            <p className="mb-2 font-medium text-slate-700">아직 추천이 없습니다</p>
            <p className="mb-6 text-sm text-slate-400">학습 기록을 바탕으로 AI가 다음 토픽을 추천해 드려요</p>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? '분석 중...' : '첫 추천 받기'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`rounded-xl border bg-white p-5 shadow-sm transition ${rec.accepted ? 'border-blue-100 bg-blue-50/40' : 'border-slate-200'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <h2 className="font-semibold text-slate-900">{rec.suggestedTopic}</h2>
                  </div>
                  {rec.accepted ? (
                    <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                      수락됨
                    </span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleAccept(rec.id)}>
                      수락
                    </Button>
                  )}
                </div>
                <p className="mt-2.5 text-sm text-slate-500">{rec.reason}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(rec.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
