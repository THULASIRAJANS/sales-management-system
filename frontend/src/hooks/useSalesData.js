import { useState, useEffect } from "react";

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const useSalesData = () => {
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalOrders: 0,
    totalDiscount: 0,
    discountOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadData = async (page = 1) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
          if (Array.isArray(filters[key])) {
            if (filters[key].length > 0) {
              queryParams.append(key, JSON.stringify(filters[key]));
            }
          } else if (typeof filters[key] === "object") {
            queryParams.append(key, JSON.stringify(filters[key]));
          } else {
            queryParams.append(key, filters[key]);
          }
        }
      });

      queryParams.append("page", page);
      queryParams.append("limit", 10);

      console.log("🔍 Fetching from:", `${API_BASE_URL}/sales?${queryParams.toString()}`);

      const salesResponse = await fetch(`${API_BASE_URL}/sales?${queryParams.toString()}`);

      if (!salesResponse.ok) {
        throw new Error(`Failed to fetch sales data: ${salesResponse.status}`);
      }

      const salesResult = await salesResponse.json();
      console.log("✅ Sales data received:", salesResult);

      setSalesData(salesResult.data || []);
      setPagination(salesResult.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10,
      });
      setStats(salesResult.stats || {
        totalUnits: 0,
        totalAmount: 0,
        totalOrders: 0,
        totalDiscount: 0,
        discountOrders: 0,
      });
      setError(null);
    } catch (err) {
      console.error("❌ Error loading data:", err);
      setError(err.message);
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData(pagination.currentPage);
  };

  const goToPage = (page) => {
    loadData(page);
  };

  return {
    salesData,
    stats,
    loading,
    error,
    pagination,
    setFilters,
    refreshData,
    goToPage,
  };
};
