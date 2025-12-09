import React, { useState, useRef, useEffect } from 'react';
import '../../styles/DateRangeFilter.css';

const DateRangeFilter = ({ selectedDates, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Generate years array (current year +10 to -100)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 111 }, (_, i) => currentYear + 10 - i);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    if (!day) return;
    
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selected);
  };

  const handleEdit = () => {
    // Reset to today's month/year when edit is clicked
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    } else {
      setCurrentDate(new Date());
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setIsOpen(false);
    onChange({ quickSelect: [], customDate: null });
  };

  const handleOK = () => {
    if (selectedDate) {
      onChange({
        quickSelect: [],
        customDate: selectedDate.toISOString().split('T')[0]
      });
    }
    setIsOpen(false);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day &&
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    return (
      currentDate.getFullYear() === selectedDate.getFullYear() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    );
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return 'Select Date';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
  };

  return (
    <div className="date-range-filter-modern" ref={dropdownRef}>
      <button 
        className="filter-trigger-modern"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="calendar-icon">📅</span>
        <span className="selected-date-text">{formatSelectedDate()}</span>
        <span className={`arrow-modern ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <div className="date-title">SELECT DATE</div>
            <div className="selected-display">
              <span>{formatSelectedDate()}</span>
              {selectedDate && (
                <button className="edit-icon" onClick={handleEdit} type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="calendar-body">
            <div className="month-year-selector">
              <button className="nav-btn" onClick={handlePrevMonth} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              
              <div className="month-year-display">
                <select 
                  className="month-select-modern"
                  value={currentDate.getMonth()}
                  onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value)))}
                >
                  {monthNames.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                
                <select
                  className="year-select-modern"
                  value={currentDate.getFullYear()}
                  onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth()))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button className="nav-btn" onClick={handleNextMonth} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>

            <div className="calendar-grid">
              <div className="weekdays">
                {weekDays.map((day) => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>

              <div className="days-grid">
                {generateCalendarDays().map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`day-cell ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''} ${hoveredDate === day ? 'hovered' : ''}`}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => setHoveredDate(day)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={!day}
                  >
                    {day || ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="calendar-footer">
            <button className="cancel-btn" onClick={handleCancel} type="button">Cancel</button>
            <button className="ok-btn" onClick={handleOK} type="button">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
