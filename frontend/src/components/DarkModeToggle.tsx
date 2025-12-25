import { useState, useEffect } from 'react';
import '../styles/navbar.css';

const DarkModeToggle: React.FC = () => {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    if (dark) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [dark]);

  return (
    <button className="dark-toggle" onClick={() => setDark(!dark)}>
      {dark ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;
