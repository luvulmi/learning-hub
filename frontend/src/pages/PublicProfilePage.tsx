import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import type { LearningRecord, PublicProfile } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PublicProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [records, setRecords] = useState<LearningRecord[]>([])

  useEffect(() => {
    Promise.all([
      axios.get<PublicProfile>(`/api/profiles/${slug}`),
      axios.get(`/api/profiles/${slug}/records`),
    ]).then(([profileRes, recordsRes]) => {
      setProfile(profileRes.data)
      setRecords(recordsRes.data.content)
    }).catch(() => {})
  }, [slug])

  if (!profile) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{profile.nickname}</h1>
          <p className="mt-1 text-muted-foreground">@{profile.profileSlug}</p>
          <p className="mt-2 text-sm text-muted-foreground">학습 기록 {profile.totalPublicRecords}개</p>
        </div>

        {records.length === 0 ? (
          <p className="text-center text-muted-foreground">공개된 학습 기록이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{record.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex flex-wrap gap-1">
                    <Badge variant="secondary">{record.category}</Badge>
                    {record.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{record.content}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(record.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
