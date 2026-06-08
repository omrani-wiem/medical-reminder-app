
import { useState, useEffect } from 'react';

export const useDashboard = () => {
  const [activeTab, setActiveTab] = useState(() =>
    localStorage.getItem('dashboardActiveTab') || 'accueil'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', activeTab);
  }, [activeTab]);

  const handleMenuClick = (itemId) => setActiveTab(itemId);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return { activeTab, sidebarCollapsed, handleMenuClick, toggleSidebar };
};