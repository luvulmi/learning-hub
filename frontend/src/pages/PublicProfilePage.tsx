import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import type { LearningRecord, PublicProfile } from '@/types'
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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white">
            {profile.nickname.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{profile.nickname}</h1>
          <p className="mt-1 text-sm text-slate-400">@{profile.profileSlug}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            📚 공개 기록 {profile.totalPublicRecords}개
          </p>
        </div>

        {records.length === 0 ? (
          <div className="py-16 text-center text-slate-400">공개된 학습 기록이 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">{record.title}</h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">{record.category}</Badge>
                  {record.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <p className="mt-2.5 line-clamp-3 text-sm text-slate-500">{record.content}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(record.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
