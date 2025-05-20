import React from "react";

import "./About.css";

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "John Smith",
      position: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description:
        "With over 20 years of experience in the flooring industry, John leads our company with expertise and vision.",
    },
    {
      name: "Sarah Johnson",
      position: "Lead Designer",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description:
        "Sarah brings creativity and innovation to every project, ensuring our clients get the perfect flooring solution.",
    },
    {
      name: "Michael Brown",
      position: "Master Craftsman",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description:
        "Michael's attention to detail and craftsmanship ensures the highest quality installation for every project.",
    },
    {
      name: "Emily Davis",
      position: "Customer Relations",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description:
        "Emily ensures that every client receives exceptional service and support throughout their project.",
    },
  ];

  return (
    <div className="about-page">
      <h1>About Us</h1>
      <p>
        Welcome to Wood Floors LLC, your trusted partner in premium wood
        flooring solutions. With 5+ years of experience in the industry, we
        specialize in delivering top-quality wood flooring installations that
        enhance the beauty and value of your space. Our dedicated team is
        committed to providing exceptional craftsmanship, personalized service,
        and durable products that stand the test of time. Whether you’re
        renovating your home or completing a commercial project, we are here to
        bring your vision to life with our expert flooring solutions.
      </p>
    </div>
  );
};

export default About;
