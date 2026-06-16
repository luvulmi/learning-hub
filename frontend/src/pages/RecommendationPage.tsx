import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recommendationsApi, type Recommendation } from '@/api/recommendations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? res.data : r))
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <button onClick={() => navigate('/records')} className="text-muted-foreground hover:text-foreground">
            ← 학습 기록
          </button>
          <h1 className="text-lg font-semibold">AI 추천</h1>
          <Button size="sm" onClick={handleCreate} disabled={loading}>
            {loading ? '분석 중...' : '새 추천 받기'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {recommendations.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">아직 추천이 없습니다.</p>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? '분석 중...' : '첫 추천 받기'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{rec.suggestedTopic}</CardTitle>
                    {rec.accepted
                      ? <Badge variant="secondary">수락됨</Badge>
                      : <Button size="sm" variant="outline" onClick={() => handleAccept(rec.id)}>수락</Button>
                    }
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(rec.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
