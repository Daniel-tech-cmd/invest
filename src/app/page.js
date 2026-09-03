import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Markets from "./components/Markets";
import Calculator from "./components/Calculator";
import Features from "./components/Features";
import Landscape from "./components/Landscape";
import RealEstate from "./components/RealEstate";
import Crypto from "./components/Crypto";
import Agriculture from "./components/Agriculture";
import HowItWorks from "./components/HowItWorks";
import Plans from "./components/Plans";
import GoldPlan from "./components/GoldPlan";
import Values from "./components/Values";
import Stats from "./components/Stats";
import Products from "./components/Products";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Markets />
        <Calculator />
        <Features />
        <Landscape />
        <RealEstate />
        <Crypto />
        <Agriculture />
        <HowItWorks />
        <Plans />
        <GoldPlan />
        <Values />
        <Stats />
        <Products />
        <Testimonials />
        <FAQ />
        <CtaBand title="Having doubts about our legitimacy?" buttonLabel="Verify us in 30 seconds" variant="ghost" />
        <CtaBand title="Start small. Let the schedule prove itself." buttonLabel="Create your account" buttonHref="/signup" variant="primary" />
      </main>
      <Footer />
    </>
  );
}
