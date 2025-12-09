import React, { useState } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import StatsCard from '../components/Dashboard/StatsCard';
import FilterBar from '../components/Dashboard/FilterBar';
import SalesTable from '../components/Table/SalesTable';
import { useSalesData } from '../hooks/useSalesData';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('services');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { salesData, stats, loading, pagination, setFilters, refreshData, goToPage } = useSalesData();
  const [currentFilters, setCurrentFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...currentFilters, [filterKey]: value };
    setCurrentFilters(newFilters);
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    refreshData();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      const newFilters = { ...currentFilters, search: query };
      setCurrentFilters(newFilters);
      setFilters(newFilters);
    }, 500);
  };

  const handlePageChange = (page) => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format number with commas and fixed decimal places
  const formatNumber = (num, decimals = 0) => {
    if (!num && num !== 0) return '0';
    const number = parseFloat(num);
    return number.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Format currency with commas and 2 decimal places
  const formatCurrency = (num) => {
    if (!num && num !== 0) return '₹0.00';
    const number = parseFloat(num);
    return `₹${number.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className={`dashboard ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <h1>Sales Management System</h1>
            <p className="header-subtitle">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name, phone, ID..." 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <FilterBar 
          filters={currentFilters} 
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
        />

        <div className="stats-container">
          <StatsCard
            title="Total units sold"
            value={formatNumber(stats.totalUnits || 0)}
            icon="📦"
            trend="+12.5%"
            trendUp={true}
          />
          <StatsCard
            title="Total Amount"
            value={formatCurrency(stats.totalAmount || 0)}
            subtitle={`${formatNumber(stats.totalOrders || 0)} Orders`}
            icon="💰"
            trend="+8.2%"
            trendUp={true}
          />
          <StatsCard
            title="Total Discount"
            value={formatCurrency(stats.totalDiscount || 0)}
            subtitle={`${formatNumber(stats.discountOrders || 0)} Orders`}
            icon="🎁"
            trend="-3.1%"
            trendUp={false}
          />
        </div>

        <SalesTable 
          data={salesData} 
          loading={loading} 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
