import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsAPI, socialAPI, analyticsAPI } from '../services/api';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState({});
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadPortfolioData = useCallback(async () => {
    try {
      const [settingsRes, socialRes] = await Promise.allSettled([
        settingsAPI.get(),
        socialAPI.getAll(),
      ]);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value.data);
      if (socialRes.status === 'fulfilled') setSocialLinks(socialRes.value.data);

      // Track visitor (fire-and-forget)
      try {
        const visitRes = await analyticsAPI.trackVisit();
        setVisitorCount(visitRes.data.totalVisitors || 0);
      } catch { /* silent */ }
    } catch {
      // Use defaults if API is down
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPortfolioData(); }, [loadPortfolioData]);

  const refreshSettings = async () => {
    const { data } = await settingsAPI.get();
    setSettings(data);
  };

  return (
    <PortfolioContext.Provider value={{ settings, socialLinks, visitorCount, loading, refreshSettings }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
};
