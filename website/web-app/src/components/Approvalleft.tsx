import { useNavigate } from 'react-router-dom';
import { useHandleClicks } from '../hooks/useHandleClicks';
import { useLanguageContext } from '../context/LanguageProvider';
import { useEffect, useState } from 'react';

export default function Approvalleft() {
  const navigate = useNavigate();  
  const { handleNavClick } = useHandleClicks();  
  const { translations, language } = useLanguageContext();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  return (
    <div className='left-side'>
      <div className='profile-section'>
        <div className='profile-pic'></div>
        <div className='profile-name'>
          <h3>Administrator</h3>
          <p style={{ marginBottom: '45px' }}>{username || "Guest"}</p>
        </div>
        <ul className='nav-list'>
          <li 
            onClick={() => handleNavClick(navigate, '/admindashboard')}
            style={{ marginBottom: '20px', padding: '20px', border: 'none', borderRadius: '0' }}
          >
            {translations[language].home} 
          </li>
          <li 
            className='active'
            style={{ marginBottom: '20px', padding: '20px', border: 'none', borderRadius: '0' }}
          >
            {translations[language].approval}  
          </li>
          <li 
            onClick={() => handleNavClick(navigate, '/settings')}
            style={{ marginBottom: '20px', padding: '20px', border: 'none', borderRadius: '0' }}
          >
            {translations[language].settings} 
          </li>
          <li 
            onClick={() => handleNavClick(navigate, '/history')}
            style={{ marginBottom: '20px', padding: '20px', border: 'none', borderRadius: '0' }}
            >
              History
          </li>
        </ul>
      </div>
    </div>
  );
}
