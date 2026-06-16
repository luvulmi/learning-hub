import apiClient from './client'

export interface Recommendation {
  id: number
  suggestedTopic: string
  reason: string
  accepted: boolean
  createdAt: string
}

export const recommendationsApi = {
  list: () => apiClient.get<Recommendation[]>('/recommendations'),
  create: () => apiClient.post<Recommendation>('/recommendations'),
  accept: (id: number) => apiClient.post<Recommendation>(`/recommendations/${id}/accept`),
}
