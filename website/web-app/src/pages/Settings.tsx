import SettingsLeft from '../components/Settingsleft';
import SettingsRight from '../components/SettingsRight';
import '../../utils/Home.css';
import { LanguageProvider, useLanguageContext } from '../context/LanguageProvider'; 

export default function Settings() {
  const { language } = useLanguageContext(); // Access language from context
  
  return (
    <LanguageProvider> 
      <div className="settings-container"> 
        <SettingsLeft key={language} />
        <SettingsRight key={language} />
      </div>
    </LanguageProvider>
  );
}