import ViewRequestleft from '../components/ViewRequestleft';
import ViewRequestRight from '../components/ViewRequestRight';
import '../../utils/Home.css';
import { LanguageProvider, useLanguageContext } from '../context/LanguageProvider';

export default function ViewRequest() {
  const { language } = useLanguageContext(); // Access language from context
  
  return (
    <LanguageProvider> 
    <div className='admin-dashboard'>
      <ViewRequestleft key={language} />
      <ViewRequestRight key={language} />
    </div>
    </LanguageProvider>  
    );
}