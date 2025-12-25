import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import bg from "../assets/bg-police.jpg";
import "../styles/home.css";

export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegisterComplaint = () => {
    if (isLoggedIn) {
      navigate("/complaint-register"); // go directly to complaint registration page
    } else {
      navigate("/login"); // ask user to log in first
    }
  };

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="overlay"></div>

      <div className="content">
        <h1 className="title">🤖 COBOT Chatbox</h1>
        <p className="subtitle">
          An AI-powered chat assistant for secure, confidential communication. 
          Submit complaints, ask queries, and get guidance anonymously and safely.
        </p>

        {/* Conditional Buttons */}
        <div className="buttons">
          {!isLoggedIn && (
            <>
              <button onClick={handleRegisterComplaint} className="btn primary-btn">
                Register Complaint
              </button>
              <Link to="/login" className="btn secondary-btn">
                Login
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button onClick={handleRegisterComplaint} className="btn primary-btn">
              Go to Complaint Page
            </button>
          )}

          <Link to="/chatbot" className="btn tertiary-btn">
            Chat with COBOT
          </Link>
        </div>

        {/* Feature Section */}
        <div className="features">
          <div className="feature-card">
            <h3>🔒 Secure</h3>
            <p>End-to-end encrypted communication to protect your privacy.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Fast</h3>
            <p>Instant complaint registration and real-time updates.</p>
          </div>
          <div className="feature-card">
            <h3>🤖 Smart</h3>
            <p>AI-powered chatbot guides users step-by-step during reporting.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Transparent</h3>
            <p>Track your complaint status in real-time securely and privately.</p>
          </div>
          <div className="feature-card">
            <h3>📁 Organized</h3>
            <p>All reports are stored securely and accessible to authorized personnel only.</p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="home-overview">
          <h2>About COBOT Chatbox</h2>
          <p>
            COBOT Chatbox is a modern AI-powered communication platform designed to help civilians submit complaints, 
            ask questions, and receive guidance securely and anonymously. 
            The system ensures privacy, trust, and transparency, making communication with authorities safe and efficient.
          </p>
          <Link to="/about" className="btn about-page-btn">Learn More About COBOT</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © 2025 COBOT Chatbox | Secure Citizen Support Network
      </footer>
    </div>
  );
}
