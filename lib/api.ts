import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api'

// Create axios instance with timeout and error handling
const apiClient = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message)
    if (error.response) {
      throw new Error(error.response.data?.error || 'Server error')
    } else if (error.request) {
      throw new Error('Network error - please check your connection')
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
)

export interface Participant {
  id: string
  consent_at: string
  age_category?: string
  gender?: string
  nationality?: string
  education?: string
  occupation?: string
  recruitment_experience?: boolean
  recruitment_role?: string
  attari?: Record<string, number>
  tai?: Record<string, number>
  screening_text?: string
  baseline_use?: number
  condition?: 'control' | 'experimental'
  chat?: Array<{
    round: number
    user_message: string
    reply: string
    ts: string
  }>
  post_use?: number
  post_change?: string
  completed?: boolean
}

export interface DemographicData {
  age: string
  gender: string
  nationality: string
  education: string
  occupation: string
  recruitment_experience: boolean
  recruitment_role?: string
}

export interface AttariData {
  [key: string]: number
}

export interface TaiData {
  [key: string]: number
}

export const api = {
  createParticipant: async (payload: { consent_at: string; demographic: DemographicData }) => {
    const response = await apiClient.post(`${BASE_URL}/participant`, payload)
    return response.data
  },

  saveScales: async (payload: { participant_id: string; attari: AttariData; tai: TaiData }) => {
    const response = await apiClient.post(`${BASE_URL}/scales`, payload)
    return response.data
  },

  screening: async (payload: { participant_id: string; screening_text: string; baseline_use: number }) => {
    const response = await apiClient.post(`${BASE_URL}/screening`, payload)
    return response.data
  },

  chat: async (payload: { participant_id: string; round: number; user_message: string }) => {
    const response = await apiClient.post(`${BASE_URL}/chat`, payload)
    return response.data
  },

  getGreeting: async (payload: { participant_id: string; round: number }) => {
    const response = await apiClient.post(`${BASE_URL}/chat/greeting`, payload)
    return response.data
  },

  complete: async (payload: { participant_id: string; post_use: number; post_change: string }) => {
    const response = await apiClient.post(`${BASE_URL}/complete`, payload)
    return response.data
  }
}
