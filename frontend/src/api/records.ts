import apiClient from './client'
import type { LearningRecord, Page } from '@/types'

export interface RecordRequest {
  title: string
  content: string
  category: string
  tags: string[]
  isPublic: boolean
}

export const recordsApi = {
  list: (page = 0, size = 10) =>
    apiClient.get<Page<LearningRecord>>('/records', { params: { page, size } }),

  get: (id: number) =>
    apiClient.get<LearningRecord>(`/records/${id}`),

  create: (data: RecordRequest) =>
    apiClient.post<LearningRecord>('/records', data),

  update: (id: number, data: RecordRequest) =>
    apiClient.put<LearningRecord>(`/records/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/records/${id}`),
}
