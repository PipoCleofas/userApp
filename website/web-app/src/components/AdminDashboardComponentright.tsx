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
        <div className="chart-section">
          <h3 style={{ marginBottom: '40px' }}>{t.serviceprovidernumber}</h3>
          <div className="chart-container" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <div className="legend" style={{ marginRight: '20px' }}>
              <div>
                <span className="legend-color police" style={{ display: 'inline-block', width: '30px', borderRadius: '15px', height: '18px', backgroundColor: 'blue' }}></span> 
                {t.police} <span style={{ color: 'white', marginInline: '10px' }}>75%</span>
              </div>
              <div>
                <span className="legend-color firefighter" style={{ display: 'inline-block', width: '30px', borderRadius: '15px', height: '18px', backgroundColor: 'red' }}></span> 
                {t.firefighter} <span style={{ color: 'white', marginInline: '10px' }}>25%</span>
              </div>
              <div>
                <span className="legend-color medical" style={{ display: 'inline-block', width: '30px', borderRadius: '15px', height: '18px', backgroundColor: 'yellow' }}></span> 
                {t.medical} <span style={{ color: 'white', marginInline: '10px' }}>10%</span>
              </div>
            </div>
            <div className="chart" style={{ display: 'flex', justifyContent: 'center', marginInline: '50px' }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}