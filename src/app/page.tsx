import SpeackersSection from "@/components/home/SectionSpeackers";
import SugestionsForResources from "@/components/home/Sugestions";
import FeaturedResourcesSection from "@/components/home/FeaturedResourcesSection";
import RecentWeeklyCarousel from "@/components/home/RecentWeeklyCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import Hero from "@/components/page/Hero";
import { loadFeaturedResources, loadRecentWeeklyResources } from "@/api/api";

export default async function Home() {
  const [featuredResources, recentWeeklyResources] = await Promise.all([
    loadFeaturedResources(),
    loadRecentWeeklyResources(),
  ]);

  return (
    <>
      <ScrollReveal>
        <Hero />
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <FeaturedResourcesSection resources={featuredResources} />
      </ScrollReveal>

      <ScrollReveal delayMs={120}>
        <RecentWeeklyCarousel resources={recentWeeklyResources} />
      </ScrollReveal>

      <ScrollReveal delayMs={120}>
        <SpeackersSection />
      </ScrollReveal>
      <ScrollReveal delayMs={200}>
        <SugestionsForResources />
      </ScrollReveal>
    </>
  );
}
