import { useLanguage } from '../hooks/useLanguage';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaGlobe, FaPalette } from 'react-icons/fa';
import '../styles/settings.css';

const Settings = () => {
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="settings-container">
      <h2><FaPalette className="icon" /> Settings</h2>
      
      <div className="settings-section">
        <h3><FaGlobe className="icon" /> Language Settings</h3>
        <p className="section-desc">Choose your preferred language for the application interface</p>
        <div className="language-options">
          <button 
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button 
            className={`lang-btn ${language === 'ta' ? 'active' : ''}`}
            onClick={() => setLanguage('ta')}
          >
            தமிழ்
          </button>
          <button 
            className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
            onClick={() => setLanguage('hi')}
          >
            हिंदी
          </button>
          <button 
            className={`lang-btn ${language === 'ml' ? 'active' : ''}`}
            onClick={() => setLanguage('ml')}
          >
            മലയാളം
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>{theme === 'light' ? <FaSun className="icon" /> : <FaMoon className="icon" />} Theme Settings</h3>
        <p className="section-desc">Choose between light and dark theme for better visibility</p>
        <div className="theme-toggle">
          <button 
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
          >
            <FaSun /> Light
          </button>
          <button 
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
          >
            <FaMoon /> Dark
          </button>
        </div>
      </div>

      <div className="settings-info">
        <p>Your settings are automatically saved and will be remembered next time you visit.</p>
      </div>
    </div>
  );
};

export default Settings;