import Nav from '@/components/layout/Nav'
import ParallaxHero from '@/components/ParallaxHero'
import SpeciesCounter from '@/components/SpeciesCounter'
import HowItWorksTimeline from '@/components/HowItWorksTimeline'
import WhoWeAre from '@/components/WhoWeAre'
import FeaturedProjects from '@/components/FeaturedProjects'
import FeedSection from '@/components/FeedSection'
import CtaSection from '@/components/CtaSection'
import StatsBar from '@/components/StatsBar'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createClient()

  const { data: updates } = await supabase
    .from('updates')
    .select(`
      *,
      project:projects (
        *,
        organization:organizations (*)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: featuredProjects } = await supabase
    .from('projects')
    .select('*, organization:organizations(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4)

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { data: donationStats } = await supabase
    .from('donations')
    .select('amount')

  const totalRaised = donationStats?.reduce((sum, d) => sum + Number(d.amount), 0) ?? 0

  return (
    <main>
      <Nav />
      <ParallaxHero />
      <WhoWeAre />
      <HowItWorksTimeline />
      <FeaturedProjects projects={featuredProjects ?? []} totalCount={projectCount ?? 247} />
      <SpeciesCounter />
      <FeedSection updates={updates ?? []} />
      <StatsBar projectCount={projectCount ?? 247} totalRaised={totalRaised} />
      <CtaSection />
    </main>
  )
}