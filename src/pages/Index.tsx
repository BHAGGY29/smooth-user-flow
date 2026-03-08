import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import GallerySection from "@/components/landing/GallerySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import VideoTestimonialsSection from "@/components/landing/VideoTestimonialsSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <StatsSection />
    <GallerySection />
    <TestimonialsSection />
    <VideoTestimonialsSection />
  </Layout>
);

export default Index;
