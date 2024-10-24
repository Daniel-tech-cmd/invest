import React from "react";
import AboutUs from "../components/About";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const page = () => {
  return (
    <div>
      <Navbar />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default page;
