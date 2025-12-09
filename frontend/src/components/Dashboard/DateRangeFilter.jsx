import React, { useState, useRef, useEffect } from 'react';
import '../../styles/DateRangeFilter.css';

const DateRangeFilter = ({ selectedDates, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickSelect, setQuickSelect] = useState([]);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
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

  const quickOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Custom', value: 'custom' }
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleQuickSelect = (value) => {
    if (value === 'custom') {
      if (showCustomPicker) {
        // Closing custom picker
        setShowCustomPicker(false);
        setSelectedDay('');
        setSelectedMonth('');
        setSelectedYear('');
        const newQuickSelect = quickSelect.filter(v => v !== 'custom');
        setQuickSelect(newQuickSelect);
        updateParent(newQuickSelect, null);
      } else {
        // Opening custom picker - DON'T send update yet
        setShowCustomPicker(true);
        const newQuickSelect = quickSelect.filter(v => v !== 'custom');
        setQuickSelect([...newQuickSelect, 'custom']);
        // DO NOT call updateParent here - wait for date selection
      }
    } else {
      // Regular quick select option
      if (showCustomPicker) {
        setShowCustomPicker(false);
        setSelectedDay('');
        setSelectedMonth('');
        setSelectedYear('');
      }
      
      const newQuickSelect = quickSelect.filter(v => v !== 'custom');
      const updatedSelect = newQuickSelect.includes(value)
        ? newQuickSelect.filter(v => v !== value)
        : [...newQuickSelect, value];
      
      setQuickSelect(updatedSelect);
      updateParent(updatedSelect, null);
    }
  };

  const updateParent = (quick = quickSelect, customDateOverride = undefined) => {
    let customDate = customDateOverride !== undefined ? customDateOverride : null;
    
    if (customDateOverride === undefined && selectedDay && selectedMonth && selectedYear) {
      // Format: "day/monthName/year"
      customDate = `${selectedDay}/${selectedMonth}/${selectedYear}`;
      console.log('📅 Custom date selected:', customDate);
    }

    // Filter out 'custom' from quickSelect before sending
    const filteredQuickSelect = quick.filter(v => v !== 'custom');

    const filterData = { 
      quickSelect: filteredQuickSelect, 
      customDate 
    };
    
    console.log('📤 Sending to parent:', filterData);
    onChange(filterData);
  };

  const handleCustomDateChange = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      // Only update when all three fields are filled
      updateParent(quickSelect);
    }
  };

  const clearAll = () => {
    setQuickSelect([]);
    setShowCustomPicker(false);
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
    onChange({ quickSelect: [], customDate: null });
  };

  const getTotalSelections = () => {
    let count = quickSelect.filter(v => v !== 'custom').length;
    if (selectedDay && selectedMonth && selectedYear) {
      count += 1;
    }
    return count;
  };

  return (
    <div className="date-range-filter" ref={dropdownRef}>
      <button 
        className="filter-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="filter-title">
          📅 Date Range
          {getTotalSelections() > 0 && (
            <span className="filter-count">{getTotalSelections()}</span>
          )}
        </span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="filter-dropdown date-dropdown">
          <div className="filter-header">
            <span className="dropdown-title">Select Date Range</span>
            {getTotalSelections() > 0 && (
              <button className="clear-btn" onClick={clearAll}>Clear All</button>
            )}
          </div>

          <div className="date-content">
            <div className="quick-select-section">
              <div className="section-title">Quick Select</div>
              <div className="quick-options">
                {quickOptions.map((option) => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={quickSelect.includes(option.value)}
                      onChange={() => handleQuickSelect(option.value)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="option-text">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {showCustomPicker && (
              <div className="custom-date-section">
                <div className="section-title-row">
                  <div className="section-title">Custom Date</div>
                  {(selectedDay || selectedMonth || selectedYear) && (
                    <button 
                      className="clear-custom-btn" 
                      onClick={() => {
                        setSelectedDay('');
                        setSelectedMonth('');
                        setSelectedYear('');
                        updateParent(quickSelect, null);
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="date-selectors-single">
                  <select
                    className="date-select day-select"
                    value={selectedDay}
                    onChange={(e) => {
                      setSelectedDay(e.target.value);
                      setTimeout(handleCustomDateChange, 0);
                    }}
                  >
                    <option value="">Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>

                  <select
                    className="date-select month-select"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setTimeout(handleCustomDateChange, 0);
                    }}
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>

                  <select
                    className="date-select year-select"
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setTimeout(handleCustomDateChange, 0);
                    }}
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {selectedDay && selectedMonth && selectedYear && (
                  <div className="selected-range">
                    <strong>Selected:</strong> {selectedDay} {selectedMonth} {selectedYear}
                  </div>
                )}
              </div>
            )}

            {!showCustomPicker && (
              <div className="custom-date-section custom-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon">📅</div>
                  <p className="placeholder-text">Select "Custom" to pick a specific date</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
