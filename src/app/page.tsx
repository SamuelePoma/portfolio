import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { StackSection } from "@/components/home/StackSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <StackSection />
      <About />
      <Contact />
    </>
  );
}
