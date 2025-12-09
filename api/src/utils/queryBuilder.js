class QueryBuilder {
  constructor() {
    this.whereConditions = [];
    this.params = [];
  }

  // Add filter for customer region (multi-select)
  addCustomerRegionFilter(regions) {
    if (regions && regions.length > 0) {
      const placeholders = regions.map(() => "?").join(",");
      this.whereConditions.push(`c.customer_region IN (${placeholders})`);
      this.params.push(...regions);
    }
    return this;
  }

  // Add filter for gender (multi-select)
  addGenderFilter(genders) {
    if (genders && genders.length > 0) {
      const placeholders = genders.map(() => "?").join(",");
      this.whereConditions.push(`c.gender IN (${placeholders})`);
      this.params.push(...genders);
    }
    return this;
  }

  // Add filter for age range (multi-select)
  addAgeRangeFilter(ageRanges) {
    if (ageRanges && ageRanges.length > 0) {
      const ageConditions = ageRanges.map((range) => {
        if (range.includes("+")) {
          const min = parseInt(range.replace("+", ""));
          return `(c.age >= ${min})`;
        } else {
          const [min, max] = range.split("-").map(Number);
          return `(c.age BETWEEN ${min} AND ${max})`;
        }
      });
      this.whereConditions.push(`(${ageConditions.join(" OR ")})`);
    }
    return this;
  }

  // Add filter for product category (multi-select)
  addProductCategoryFilter(categories) {
    if (categories && categories.length > 0) {
      const placeholders = categories.map(() => "?").join(",");
      this.whereConditions.push(`p.product_category IN (${placeholders})`);
      this.params.push(...categories);
    }
    return this;
  }

  // Add filter for tags (multi-select)
  addTagsFilter(tags) {
    if (tags && tags.length > 0) {
      const placeholders = tags.map(() => "?").join(",");
      this.whereConditions.push(`pt.tag IN (${placeholders})`);
      this.params.push(...tags);
    }
    return this;
  }

  // Add filter for payment method (multi-select)
  addPaymentMethodFilter(methods) {
    if (methods && methods.length > 0) {
      const placeholders = methods.map(() => "?").join(",");
      this.whereConditions.push(`t.payment_method IN (${placeholders})`);
      this.params.push(...methods);
    }
    return this;
  }

  // Convert month name to number (1-12)
  getMonthNumber(monthName) {
    const months = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };
    return months[monthName.toLowerCase()] || null;
  }

  // Add date filters with comprehensive logging
  addDateFilter(dateFilter) {
    if (!dateFilter) return this;

    console.log(
      "📅 Date Filter Received:",
      JSON.stringify(dateFilter, null, 2)
    );

    const { quickSelect, customDate } = dateFilter;

    // Handle quick select dates
    if (quickSelect && Array.isArray(quickSelect) && quickSelect.length > 0) {
      const dateConditions = [];

      quickSelect.forEach((option) => {
        if (option === "custom") {
          return; // Skip 'custom' - handled separately
        }

        console.log("⚡ Processing quick select:", option);

        switch (option) {
          case "today":
            dateConditions.push("DATE(t.date) = CURDATE()");
            break;
          case "yesterday":
            dateConditions.push(
              "DATE(t.date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)"
            );
            break;
          case "last7days":
            dateConditions.push(
              "DATE(t.date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
            );
            break;
          case "last30days":
            dateConditions.push(
              "DATE(t.date) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)"
            );
            break;
          case "thisMonth":
            dateConditions.push(
              "MONTH(t.date) = MONTH(CURDATE()) AND YEAR(t.date) = YEAR(CURDATE())"
            );
            break;
          case "lastMonth":
            dateConditions.push(
              "MONTH(t.date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(t.date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))"
            );
            break;
          default:
            console.warn("⚠️ Unknown quick select option:", option);
        }
      });

      if (dateConditions.length > 0) {
        const condition = `(${dateConditions.join(" OR ")})`;
        console.log("✅ Quick select SQL condition:", condition);
        this.whereConditions.push(condition);
      }
    }

    // Handle custom date - Supports both formats
    if (customDate && customDate.trim() !== "") {
      console.log("🗓️ Processing custom date:", customDate);

      // Check if it's ISO format (YYYY-MM-DD)
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (isoDateRegex.test(customDate)) {
        // ISO Format: 2025-12-09
        console.log("✅ Valid ISO date format detected:", customDate);
        this.whereConditions.push("DATE(t.date) = ?");
        this.params.push(customDate);
        console.log("🔍 SQL: DATE(t.date) = ?", customDate);
      } else if (customDate.includes("/")) {
        // Old Format: day/month/year or day/MonthName/year
        const parts = customDate.split("/");

        if (parts.length === 3) {
          const day = parts[0].trim();
          const monthInput = parts[1].trim();
          const year = parts[2].trim();

          console.log("📊 Date parts:", { day, month: monthInput, year });

          // Convert month (could be name or number)
          let monthNumber;
          if (isNaN(monthInput)) {
            // Month is a name
            monthNumber = this.getMonthNumber(monthInput);
            console.log(
              `🔄 Converted month name "${monthInput}" to number:`,
              monthNumber
            );
          } else {
            // Month is already a number
            monthNumber = parseInt(monthInput);
            console.log("🔢 Month is already a number:", monthNumber);
          }

          if (monthNumber && monthNumber >= 1 && monthNumber <= 12) {
            // Pad with zeros
            const paddedDay = day.padStart(2, "0");
            const paddedMonth = monthNumber.toString().padStart(2, "0");

            // Format: YYYY-MM-DD for MySQL
            const formattedDate = `${year}-${paddedMonth}-${paddedDay}`;

            console.log("✅ Formatted date for MySQL:", formattedDate);
            console.log("🔍 SQL: DATE(t.date) = ?", formattedDate);

            this.whereConditions.push("DATE(t.date) = ?");
            this.params.push(formattedDate);
          } else {
            console.error("❌ Invalid month number:", monthNumber);
          }
        } else {
          console.error(
            "❌ Invalid custom date format. Expected 3 parts, got:",
            parts.length
          );
        }
      } else {
        console.error("❌ Unrecognized date format:", customDate);
      }
    }

    return this;
  }

  // Add search filter
  addSearchFilter(search) {
    if (search) {
      this.whereConditions.push(
        `(c.customer_name LIKE ? OR c.phone_number LIKE ? OR c.customer_id LIKE ?)`
      );
      const searchPattern = `%${search}%`;
      this.params.push(searchPattern, searchPattern, searchPattern);
    }
    return this;
  }

  // Build WHERE clause
  buildWhereClause() {
    if (this.whereConditions.length === 0) {
      return { clause: "", params: [] };
    }

    const clause = "WHERE " + this.whereConditions.join(" AND ");
    console.log("🔧 Final WHERE clause:", clause);
    console.log("🔧 Final params:", this.params);

    return {
      clause,
      params: this.params,
    };
  }

  // Build ORDER BY clause
  buildOrderByClause(sortBy) {
    const sortOptions = {
      "name-asc": "c.customer_name ASC",
      "name-desc": "c.customer_name DESC",
      "amount-asc": "t.final_amount ASC",
      "amount-desc": "t.final_amount DESC",
      "date-asc": "t.date ASC",
      "date-desc": "t.date DESC",
    };

    return sortOptions[sortBy] || "t.date DESC";
  }
}

module.exports = QueryBuilder;
