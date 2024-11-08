import ComboBox from '../components/comboboxholder/Combobox';
import { useLanguageContext } from '../context/LanguageProvider';

export default function SettingsRight() {
  const { translations, language, changeLanguage } = useLanguageContext();
  const t = translations[language];

  const data = [
    { label: 'English', value: 'English' },
    { label: 'Filipino', value: 'Filipino' },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      position: 'relative',
      width: '100%',
      height: '100vh',
      boxSizing: 'border-box',
      overflowX: 'hidden', // Only hide horizontal overflow
    }}>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        textAlign: 'left',
        width: '200px',
        zIndex: 1000,
      }}>
        <h3 style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>{t.chooselang}</h3>
        <ComboBox onValueChange={changeLanguage} data={data} value={language} />
      </div>
    </div>
  );
}
