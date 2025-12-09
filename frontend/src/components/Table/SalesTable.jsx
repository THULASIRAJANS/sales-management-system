import React from 'react';
import '../../styles/Table.css';

const SalesTable = ({ data, loading, pagination, onPageChange }) => {
  const handleCopyPhone = (phone) => {
    navigator.clipboard.writeText(phone).then(() => {
      alert('Phone number copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      onPageChange(pageNumber);
    }
  };

  const goToPrevious = () => {
    if (pagination.currentPage > 1) {
      onPageChange(pagination.currentPage - 1);
    }
  };

  const goToNext = () => {
    if (pagination.currentPage < pagination.totalPages) {
      onPageChange(pagination.currentPage + 1);
    }
  };

  // Format currency with 2 decimal places and commas
  const formatCurrency = (num) => {
    if (!num && num !== 0) return '₹0.00';
    const number = parseFloat(num);
    return `₹${number.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const totalPages = pagination.totalPages || 1;
    const currentPage = pagination.currentPage || 1;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="loading">No data available</div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Customer name</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Product Category</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Customer region</th>
              <th>Product ID</th>
              <th>Employee name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.transaction_id || index}>
                <td>{row.transaction_id || '-'}</td>
                <td>{row.date ? new Date(row.date).toLocaleDateString('en-GB') : '-'}</td>
                <td>{row.customer_id || '-'}</td>
                <td>{row.customer_name || '-'}</td>
                <td>
                  {row.phone_number || '-'}
                  {row.phone_number && (
                    <span 
                      className="copy-icon"
                      onClick={() => handleCopyPhone(row.phone_number)}
                      title="Copy phone number"
                    >
                      📋
                    </span>
                  )}
                </td>
                <td>{row.gender || '-'}</td>
                <td>{row.age || '-'}</td>
                <td>{row.product_category || '-'}</td>
                <td>{row.quantity || '-'}</td>
                <td>{formatCurrency(row.total_amount)}</td>
                <td>{row.customer_region || '-'}</td>
                <td>{row.product_id || '-'}</td>
                <td>{row.employee_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          className="page-btn nav-btn"
          onClick={goToPrevious}
          disabled={pagination.currentPage === 1}
        >
          ‹ Previous
        </button>

        {getPageNumbers().map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="ellipsis">...</span>
          ) : (
            <button
              key={pageNum}
              className={`page-btn ${pagination.currentPage === pageNum ? 'active' : ''}`}
              onClick={() => goToPage(pageNum)}
            >
              {pageNum}
            </button>
          )
        ))}

        <button 
          className="page-btn nav-btn"
          onClick={goToNext}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next ›
        </button>
      </div>

      <div className="pagination-info">
        Showing {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of {pagination.totalRecords.toLocaleString('en-IN')} entries
      </div>
    </div>
  );
};

export default SalesTable;
