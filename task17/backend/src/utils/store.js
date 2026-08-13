import crypto from 'node:crypto';

// In-memory persistent database & log tracker for ShieldForm
class DataStore {
  constructor() {
    this.users = [
      {
        id: "usr_9981",
        name: "Elena Rostova",
        email: "elena.rostova@cybersec.io",
        role: "admin",
        age: 29,
        phone: "+1-555-0192",
        country: "United States",
        status: "Validated & Active",
        createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
      },
      {
        id: "usr_9982",
        name: "Marcus Vance",
        email: "marcus.vance@techfirm.dev",
        role: "developer",
        age: 34,
        phone: "+44-20-7946-0912",
        country: "United Kingdom",
        status: "Validated & Active",
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
      },
      {
        id: "usr_9983",
        name: "Aria Chen",
        email: "aria.chen@securitylab.org",
        role: "analyst",
        age: 26,
        phone: "+65-6789-0123",
        country: "Singapore",
        status: "Validated & Active",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ];

    this.logs = [
      {
        id: "REQ-1020",
        endpoint: "/api/users",
        method: "POST",
        status: "VALID",
        statusCode: 200,
        responseTimeMs: 14,
        fieldsEvaluated: ["name", "email", "password", "confirmPassword", "age", "phone", "country", "role"],
        failedFields: [],
        errors: {},
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "REQ-1021",
        endpoint: "/api/users",
        method: "POST",
        status: "REJECTED",
        statusCode: 400,
        responseTimeMs: 8,
        fieldsEvaluated: ["name", "email", "password", "age"],
        failedFields: ["email", "password"],
        errors: {
          email: "Invalid email address format",
          password: "Password must contain at least one uppercase letter and one number"
        },
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString()
      },
      {
        id: "REQ-1022",
        endpoint: "/api/users",
        method: "POST",
        status: "VALID",
        statusCode: 200,
        responseTimeMs: 11,
        fieldsEvaluated: ["name", "email", "password", "confirmPassword", "age", "phone", "country", "role"],
        failedFields: [],
        errors: {},
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
      },
      {
        id: "REQ-1023",
        endpoint: "/api/users",
        method: "POST",
        status: "REJECTED",
        statusCode: 400,
        responseTimeMs: 6,
        fieldsEvaluated: ["name", "email", "age"],
        failedFields: ["age", "confirmPassword"],
        errors: {
          age: "User must be at least 18 years old",
          confirmPassword: "Passwords must match"
        },
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ];

    this.stats = {
      totalRequestsToday: 148,
      validRequestsToday: 139,
      rejectedRequestsToday: 9,
      avgResponseTimeMs: 10.4
    };
  }

  addUser(userData) {
    const newUser = {
      id: `usr_${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      age: Number(userData.age),
      phone: userData.phone || 'N/A',
      country: userData.country || 'N/A',
      status: 'Validated & Active',
      createdAt: new Date().toISOString()
    };
    this.users.unshift(newUser);
    return newUser;
  }

  getUsers() {
    return this.users;
  }

  addLog(logData) {
    const newLog = {
      id: `REQ-${Math.floor(1024 + Math.random() * 8976)}`,
      endpoint: logData.endpoint || '/api/users',
      method: logData.method || 'POST',
      status: logData.status, // 'VALID' | 'REJECTED'
      statusCode: logData.statusCode,
      responseTimeMs: logData.responseTimeMs || Math.floor(5 + Math.random() * 12),
      fieldsEvaluated: logData.fieldsEvaluated || ["name", "email", "password", "confirmPassword", "age", "phone", "country", "role"],
      failedFields: logData.failedFields || [],
      errors: logData.errors || {},
      timestamp: new Date().toISOString()
    };

    this.logs.unshift(newLog);

    // Update statistics
    this.stats.totalRequestsToday += 1;
    if (logData.status === 'VALID') {
      this.stats.validRequestsToday += 1;
    } else {
      this.stats.rejectedRequestsToday += 1;
    }

    // Recalculate average response time
    this.stats.avgResponseTimeMs = Number(
      ((this.stats.avgResponseTimeMs * (this.stats.totalRequestsToday - 1) + newLog.responseTimeMs) / this.stats.totalRequestsToday).toFixed(1)
    );

    return newLog;
  }

  getLogs(limit = 50) {
    return this.logs.slice(0, limit);
  }

  clearLogs() {
    this.logs = [];
    return true;
  }

  getStats() {
    const total = this.stats.totalRequestsToday;
    const valid = this.stats.validRequestsToday;
    const rejected = this.stats.rejectedRequestsToday;
    const validationRate = total > 0 ? ((valid / total) * 100).toFixed(1) : "100.0";

    // Count top failed fields
    const fieldFailCounts = {};
    this.logs.forEach((log) => {
      if (log.failedFields) {
        log.failedFields.forEach((field) => {
          fieldFailCounts[field] = (fieldFailCounts[field] || 0) + 1;
        });
      }
    });

    return {
      totalRequestsToday: total,
      validRequestsToday: valid,
      rejectedRequestsToday: rejected,
      validationRate: `${validationRate}%`,
      avgResponseTimeMs: `${this.stats.avgResponseTimeMs}ms`,
      mostCommonIssue: Object.keys(fieldFailCounts).length > 0 
        ? Object.entries(fieldFailCounts).sort((a,b) => b[1] - a[1])[0][0]
        : "Invalid Email",
      fieldFailCounts
    };
  }
}

export const store = new DataStore();
