import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../styles/language-selector.css';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-select">
      <select
        aria-label="Select language"
        value={language}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setLanguage(e.target.value as 'en' | 'ta' | 'hi' | 'ml')
        }
        className="lang-dropdown"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ்</option>
        <option value="hi">हिंदी</option>
        <option value="ml">മലയാളം</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
