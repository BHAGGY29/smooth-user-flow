import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import ProgramsSection from "@/components/landing/ProgramsSection";
import GallerySection from "@/components/landing/GallerySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <StatsSection />
    <ProgramsSection />
    <GallerySection />
    <TestimonialsSection />
  </Layout>
);

export default Index;
