export interface LearningRecord {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface PublicProfile {
  nickname: string
  profileSlug: string
  totalPublicRecords: number
}

export interface Page<T> {
  content: T[]
  page: {
    totalElements: number
    totalPages: number
    number: number
    size: number
  }
}
