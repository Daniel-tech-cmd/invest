import Image from "next/image";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import PayyedInvestors from "./components/Investors";
import WhyChooseUs from "./components/WhyChooseUs";
import RealEstateInvestment from "./components/RealEstateInvestment";
import CryptocurrencyCarousel from "./components/CryptoCarose";
import InvestmentPlans from "./components/InvestmentPlans";
import AgriculturalProducts from "./components/Agricplans";
import OurValuesSection from "./components/OurValue";
import Testimonials from "./components/Reviews";
import FAQ from "./components/FaQ";
import Products from "./components/Products";
import TradingViewTimelineWidget from "./components/News";
import Footer from "./components/Footer";
import Statistics from "./components/Statistics";
import VerifySection from "./components/Verify";
import NotificationPopup from "./components/Notify";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <PayyedInvestors />
      <WhyChooseUs />
      <RealEstateInvestment />
      <CryptocurrencyCarousel />
      <InvestmentPlans />
      <AgriculturalProducts />
      <OurValuesSection />
      <Testimonials />
      <FAQ />
      <Products />
      <Statistics />
      <VerifySection />
      <NotificationPopup />
      <TradingViewTimelineWidget />
      <Footer />
    </>
  );
}
