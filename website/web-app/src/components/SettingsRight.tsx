import ComboBox from '../components/comboboxholder/Combobox';
import { useLanguageContext } from '../context/LanguageProvider';

export default function SettingsRight() {
  const { language, changeLanguage } = useLanguageContext();

  const data = [
    { label: 'English', value: 'English' },
    { label: 'Filipino', value: 'Filipino' },
  ];

  return (
    <div>
      <h3>Choose Language</h3>
      <ComboBox onValueChange={changeLanguage} data={data} value={language} />
    </div>
  );
}