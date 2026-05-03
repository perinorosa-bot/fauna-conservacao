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
  verified_at: string | null
  user_id: string
}

export type Project = {
  id: string
  created_at: string
  organization_id: string
  organization?: Organization | null
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
  project?: Project | null
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
  subscription_id?: string | null
  stripe_invoice_id?: string | null
  stripe_payment_intent_id?: string | null
}

export type SubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused'

export type Subscription = {
  id: string
  donor_user_id: string | null
  donor_email: string
  donor_name: string | null
  project_id: string
  organization_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  amount: number
  currency: string
  status: SubscriptionStatus
  cancel_at_period_end: boolean
  current_period_end: string | null
  canceled_at: string | null
  created_at: string
  updated_at: string
  project?: Project
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'donor' | 'organization' | 'admin'
}
