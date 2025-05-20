import React from "react";
import Slider from "../components/Slider";
import Calculator from "../components/Calculator";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home">
      <Slider />
      <section className="calculator-section">
        <Calculator />
      </section>
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          We are a team of professionals specializing in landscape design and
          garden care. Our mission is to create beautiful and functional spaces
          that will delight you all year round.
        </p>
      </section>
    </div>
  );
};

export default Home;
