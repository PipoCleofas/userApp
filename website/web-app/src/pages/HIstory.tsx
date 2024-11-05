import HistoryLeft from '../components/HistoryLeft';
import HistoryRight from '../components/HistoryRight';
import '../../utils/Home.css';
import { LanguageProvider, useLanguageContext } from '../context/LanguageProvider'; 

export default function History() {
  const { language } = useLanguageContext(); // Access language from context

  return (
    <LanguageProvider> 
    <div className='admin-dashboard'>
      <HistoryLeft key={language} />
      <HistoryRight key={language} />
    </div>
    </LanguageProvider>
  );
}