export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  active_role: string | null
  roles: string[]
}

export interface Review {
  id: number
  reviewer_name: string
  rating: number
  comment: string
  user_id: number | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}