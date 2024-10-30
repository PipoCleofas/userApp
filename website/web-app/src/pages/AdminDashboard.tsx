import AdminDashboardComponentLeft from '../components/AdminDashboardComponentsleft';
import AdminDashboardComponentRight from '../components/AdminDashboardComponentright';
import '../../utils/Home.css';
import { LanguageProvider, useLanguageContext } from '../context/LanguageProvider';  

export default function AdminDashboard() {
  const { language } = useLanguageContext(); 
  
  return (
    <LanguageProvider>
    <div className='admin-dashboard'>
      <AdminDashboardComponentLeft key={language} />
      <AdminDashboardComponentRight key={language} />
    </div>
    </LanguageProvider>
    );
}