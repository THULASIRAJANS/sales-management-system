const API_BASE_URL = "http://localhost:3001/api";

export const fetchSalesData = async (filters = {}, page = 1, limit = 10) => {
  try {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== null &&
        filters[key] !== undefined &&
        filters[key] !== ""
      ) {
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
    queryParams.append("limit", limit);

    const response = await fetch(
      `${API_BASE_URL}/sales?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch sales data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

export const fetchStats = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== null &&
        filters[key] !== undefined &&
        filters[key] !== "" &&
        key !== "sortBy"
      ) {
        if (Array.isArray(filters[key])) {
          if (filters[key].length > 0) {
            queryParams.append(key, JSON.stringify(filters[key]));
          }
        } else if (typeof filters[key] === "object") {
          queryParams.append(key, JSON.stringify(filters[key]));
        }
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/stats?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};
