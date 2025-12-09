import React from 'react';

const StatsCard = ({ title, value, subtitle, icon, trend, trendUp }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon-wrapper">
        <div className="stats-icon">{icon}</div>
      </div>
      
      <div className="stats-content">
        <div className="stats-header">
          <span className="stats-title">{title}</span>
        </div>
        
        <div className="stats-value">{value}</div>
        
        <div className="stats-footer">
          {subtitle && <span className="stats-subtitle">{subtitle}</span>}
          {trend && (
            <span className={`stats-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
              <span className="trend-icon">{trendUp ? '↗' : '↘'}</span>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
