export type Organization = {
  id: string
  created_at: string
  name: string
  slug: string
  description: string
  country: string
  website: string | null
  logo_url: string | null
  verified: boolean
  user_id: string
}

export type Project = {
  id: string
  created_at: string
  organization_id: string
  organization?: Organization
  title: string
  slug: string
  description: string
  full_description: string
  species: string
  biome: string
  country: string
  lat: number | null
  lng: number | null
  cover_image_url: string | null
  goal_amount: number
  raised_amount: number
  currency: string
  status: 'active' | 'completed' | 'paused'
  tags: string[]
}

export type Update = {
  id: string
  created_at: string
  project_id: string
  project?: Project
  title: string
  content: string
  image_url: string | null
  author_name: string
}

export type Donation = {
  id: string
  created_at: string
  project_id: string
  user_id: string | null
  donor_name: string
  donor_email: string
  amount: number
  currency: string
  message: string | null
  anonymous: boolean
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'donor' | 'organization' | 'admin'
}
