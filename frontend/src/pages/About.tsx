// src/components/About.tsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

import { AuthContext } from "../context/AuthContext";

import secureImg from "../assets/secure.png";
import aiChatImg from "../assets/ai-chat.png";
import cloudImg from "../assets/cloud.png";
import reportImg from "../assets/report.png";

const services = [
  {
    img: secureImg,
    title: "Secure Login",
    desc: "OTP verification and encrypted authentication for complete account security."
  },
  {
    img: aiChatImg,
    title: "AI Assistance",
    desc: "AI-powered chatbot guides users through reporting and tracking cases efficiently."
  },
  {
    img: cloudImg,
    title: "Cloud Hosting",
    desc: "Reliable cloud infrastructure ensures uptime, scalability, and data protection."
  },
  {
    img: reportImg,
    title: "Encrypted Reports",
    desc: "All case submissions are protected using strong encryption, ensuring complete confidentiality and trust."
  }
];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Navigation & Auth
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  // ✅ Start Reporting logic
  const handleStartReporting = () => {
    if (isLoggedIn) {
      navigate("/complaint-register");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? services.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="about-hero">
        <h1>Confidential Case Reporting System</h1>
        <p>
          Secure, reliable, and user-friendly platform for reporting and tracking confidential cases.
          Privacy and trust are at the core of everything we do.
        </p>
      </section>

      {/* Overview Section */}
      <section className="about-overview">
        <h2>About the App</h2>
        <p>
          The Confidential Case Reporting System enables individuals and organizations to report sensitive cases safely and efficiently.
          Our platform combines advanced security measures, intuitive design, and AI-assisted guidance to simplify case submission and tracking.
          Every report is encrypted end-to-end, ensuring full confidentiality and trust for users.
        </p>
      </section>

      {/* Features Section */}
      <section className="about-services">
        <h2>Key Features</h2>

        <div className="service-slider">

          <div className="slide-counter">
            {currentIndex + 1} / {services.length}
          </div>

          <div className="service-slide">
            <img
              src={services[currentIndex].img}
              alt={services[currentIndex].title}
            />
            <h3>{services[currentIndex].title}</h3>
            <p>{services[currentIndex].desc}</p>
          </div>

          <button className="slider-arrow left" onClick={prevSlide}>
            ❮
          </button>
          <button className="slider-arrow right" onClick={nextSlide}>
            ❯
          </button>

          <div className="slider-dots">
            {services.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>

        </div>
      </section>

      {/* Unique Advantages */}
      <section className="about-unique">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>End-to-end encrypted submissions</li>
          <li>Real-time tracking of all cases</li>
          <li>User-friendly interface designed for efficiency</li>
          <li>AI-powered assistance and support</li>
          <li>Transparent and trustworthy system</li>
        </ul>
      </section>

      {/* Statistics Section */}
      <section className="about-stats">
        <h2>Our Impact</h2>
        <div className="stats-cards">
          <div className="stat-card">
            <h3>1,500+</h3>
            <p>Cases Reported</p>
          </div>
          <div className="stat-card">
            <h3>500+</h3>
            <p>Active Organizations</p>
          </div>
          <div className="stat-card">
            <h3>98%</h3>
            <p>User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="about-tech">
        <h2>Technology Stack</h2>
        <p>
          Built with React.js, Firebase Authentication, real-time databases,
          AI integrations, and hosted securely on AWS Cloud.
        </p>
      </section>

      {/* Testimonials */}
      <section className="about-testimonials">
        <h2>What Users Say</h2>
        <div className="testimonials-cards">
          <div className="testimonial-card">
            <p>"This platform makes reporting confidential cases easy, fast, and secure."</p>
            <h4>- Sarah K., NGO Worker</h4>
          </div>
          <div className="testimonial-card">
            <p>"I can track my submissions in real-time."</p>
            <h4>- John D., Corporate User</h4>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <h2>Meet Our Team</h2>
        <p>
          Our team consists of experienced developers, AI specialists, and cybersecurity experts.
        </p>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Get Started Today</h2>
        <p>
          Join thousands of users who trust our platform for secure and confidential case reporting.
        </p>
        <button className="cta-button" onClick={handleStartReporting}>
          Start Reporting
        </button>
      </section>

    </div>
  );
};

export default About;
