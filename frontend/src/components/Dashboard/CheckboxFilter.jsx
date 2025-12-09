import React, { useState, useRef, useEffect } from 'react';
import '../../styles/CheckboxFilter.css';

const CheckboxFilter = ({ title, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(options);
  };

  return (
    <div className="checkbox-filter" ref={dropdownRef}>
      <button 
        className="filter-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="filter-title">
          {title}
          {selectedValues.length > 0 && (
            <span className="filter-count">{selectedValues.length}</span>
          )}
        </span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-header">
            <span className="dropdown-title">{title}</span>
            <div className="filter-actions">
              {selectedValues.length > 0 && selectedValues.length < options.length && (
                <button className="action-btn" onClick={selectAll}>Select All</button>
              )}
              {selectedValues.length > 0 && (
                <button className="action-btn clear" onClick={clearAll}>Clear</button>
              )}
              {selectedValues.length === 0 && (
                <button className="action-btn" onClick={selectAll}>Select All</button>
              )}
            </div>
          </div>
          
          <div className="filter-options">
            {options.map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                <span className="checkbox-custom"></span>
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckboxFilter;
