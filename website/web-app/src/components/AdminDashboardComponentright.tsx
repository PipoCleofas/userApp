import { useLanguageContext } from '../context/LanguageProvider';

export default function AdminDashboardComponentRight() {
  const { translations, language } = useLanguageContext();
  const t = translations[language];

  return (
    <div className="right-side">
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="dashboard-grid">
          <div className="dashboard-item" style={{ height: '120px', border: '10px', borderRadius: '24px' }}>{t.police}</div>
          <div className="dashboard-item" style={{ height: '120px', border: '10px', borderRadius: '24px' }}>{t.firefighter}</div>
          <div className="dashboard-item" style={{ height: '120px', border: '10px', borderRadius: '24px' }}>{t.medical}</div>
          <div className="dashboard-item" style={{ height: '120px' }}>Barangay</div>
        </div>
      </div>
    </div>
  );
}