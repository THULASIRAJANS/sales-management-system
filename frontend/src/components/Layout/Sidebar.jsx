import React, { useState } from 'react';
import '../../styles/Sidebar.css';

const Sidebar = ({ activeMenu, setActiveMenu, isOpen, setIsOpen }) => {
  const [expandedMenu, setExpandedMenu] = useState('services');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    if (menuName === 'services' || menuName === 'invoices') {
      setExpandedMenu(expandedMenu === menuName ? null : menuName);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', hasSubmenu: false },
    { id: 'nexus', label: 'Nexus', icon: '🔗', hasSubmenu: false },
    { id: 'intake', label: 'Intake', icon: '📥', hasSubmenu: false },
    { 
      id: 'services', 
      label: 'Services', 
      icon: '⚙️', 
      hasSubmenu: true,
      submenu: [
        { id: 'pre-active', label: 'Pre-active', icon: '●' },
        { id: 'active', label: 'Active', icon: '●' },
        { id: 'blocked', label: 'Blocked', icon: '●' },
        { id: 'closed', label: 'Closed', icon: '●' }
      ]
    },
    { 
      id: 'invoices', 
      label: 'Invoices', 
      icon: '🧾', 
      hasSubmenu: true,
      submenu: [
        { id: 'paid', label: 'Paid', icon: '●' },
        { id: 'unpaid', label: 'Unpaid', icon: '●' },
        { id: 'overdue', label: 'Overdue', icon: '●' }
      ]
    }
  ];

  return (
    <>
      {/* Floating Open Button - Shows when sidebar is closed */}
      {!isOpen && (
        <button 
          className="sidebar-open-btn"
          onClick={toggleSidebar}
          aria-label="Open Sidebar"
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Sidebar Header with Close Button */}
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">V</div>
            <div className="user-details">
              <h3>Vault</h3>
              <p>Apurabz Yadav</p>
            </div>
          </div>
          
          <button 
            className="sidebar-close-btn"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item-container">
              <div
                className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                {item.hasSubmenu && (
                  <span className={`menu-arrow ${expandedMenu === item.id ? 'expanded' : ''}`}>
                    ▼
                  </span>
                )}
              </div>

              {item.hasSubmenu && expandedMenu === item.id && (
                <div className="submenu">
                  {item.submenu.map((subItem) => (
                    <div
                      key={subItem.id}
                      className="submenu-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(subItem.id);
                      }}
                    >
                      <span className="submenu-icon">{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
