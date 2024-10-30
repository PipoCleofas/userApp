import Approvalleft from '../components/Approvalleft';
import ApprovalRight from '../components/ApprovalRight';
import '../../utils/Home.css';
import { LanguageProvider, useLanguageContext } from '../context/LanguageProvider'; 

export default function Approval() {
  const { language } = useLanguageContext(); // Access language from context

  return (
    <LanguageProvider> 
    <div className='admin-dashboard'>
      <Approvalleft key={language} />
      <ApprovalRight key={language} />
    </div>
    </LanguageProvider>
  );
}