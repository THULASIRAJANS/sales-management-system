import React from 'react';
import CheckboxFilter from './CheckboxFilter';
import DateRangeFilter from './DateRangeFilter';

const FilterBar = ({ filters, onFilterChange, onRefresh }) => {
  const filterOptions = {
    customerRegion: ['North', 'South', 'East', 'West'],
    gender: ['Male', 'Female', 'Other'],
    ageRange: ['18-25', '26-35', '36-45', '46-60', '60+'],
    productCategory: ['Clothing', 'Electronics', 'Food', 'Books', 'Home & Garden', 'Sports'],
    tags: ['VIP', 'Regular', 'New', 'Returning', 'Premium', 'Wholesale'],
    paymentMethod: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet'],
  };

  const handleCheckboxChange = (filterKey, values) => {
    onFilterChange(filterKey, values);
  };

  const handleDateChange = (dateData) => {
    onFilterChange('dateRange', dateData);
  };

  // Calculate total active filters
  const getTotalActiveFilters = () => {
    let count = 0;
    Object.keys(filters).forEach(key => {
      if (key === 'dateRange') {
        const dateRange = filters[key];
        if (dateRange?.quickSelect?.length > 0) count += dateRange.quickSelect.length;
        if (dateRange?.customRange?.[0] && dateRange?.customRange?.[1]) count += 1;
      } else if (Array.isArray(filters[key])) {
        count += filters[key].length;
      } else if (filters[key]) {
        count += 1;
      }
    });
    return count;
  };

  const clearAllFilters = () => {
    Object.keys(filterOptions).forEach(key => {
      onFilterChange(key, []);
    });
    onFilterChange('dateRange', { quickSelect: [], customRange: [null, null] });
    onFilterChange('sortBy', '');
  };

  const totalFilters = getTotalActiveFilters();

  return (
    <div className="filter-bar">
      <button 
        className="refresh-btn"
        onClick={onRefresh}
        title="Refresh data"
      >
        🔄
      </button>

      <CheckboxFilter
        title="Customer Region"
        options={filterOptions.customerRegion}
        selectedValues={filters.customerRegion || []}
        onChange={(values) => handleCheckboxChange('customerRegion', values)}
      />

      <CheckboxFilter
        title="Gender"
        options={filterOptions.gender}
        selectedValues={filters.gender || []}
        onChange={(values) => handleCheckboxChange('gender', values)}
      />

      <CheckboxFilter
        title="Age Range"
        options={filterOptions.ageRange}
        selectedValues={filters.ageRange || []}
        onChange={(values) => handleCheckboxChange('ageRange', values)}
      />

      <CheckboxFilter
        title="Product Category"
        options={filterOptions.productCategory}
        selectedValues={filters.productCategory || []}
        onChange={(values) => handleCheckboxChange('productCategory', values)}
      />

      <CheckboxFilter
        title="Tags"
        options={filterOptions.tags}
        selectedValues={filters.tags || []}
        onChange={(values) => handleCheckboxChange('tags', values)}
      />

      <CheckboxFilter
        title="Payment Method"
        options={filterOptions.paymentMethod}
        selectedValues={filters.paymentMethod || []}
        onChange={(values) => handleCheckboxChange('paymentMethod', values)}
      />

      <DateRangeFilter
        selectedDates={filters.dateRange || { quickSelect: [], customRange: [null, null] }}
        onChange={handleDateChange}
      />

      <select 
        className="filter-select sort-select"
        value={filters.sortBy || ''}
        onChange={(e) => onFilterChange('sortBy', e.target.value)}
      >
        <option value="">Sort by: Customer Name (A-Z)</option>
        <option value="name-desc">Customer Name (Z-A)</option>
        <option value="amount-asc">Amount (Low to High)</option>
        <option value="amount-desc">Amount (High to Low)</option>
        <option value="date-asc">Date (Oldest First)</option>
        <option value="date-desc">Date (Newest First)</option>
      </select>

      {totalFilters > 0 && (
        <button className="clear-all-btn" onClick={clearAllFilters}>
          <span>✕</span>
          Clear All ({totalFilters})
        </button>
      )}
    </div>
  );
};

export default FilterBar;
