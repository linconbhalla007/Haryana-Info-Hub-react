import { getHomepageSectionsPublic } from '../admin/services/adminApi.js';

/**
 * =========================================================================
 * CONFIGURATION VALUE TO UPDATE WHEN ACTUAL BACKEND API IS READY:
 * =========================================================================
 * `LATEST_UPDATES_API_ENDPOINT` defines the endpoint path.
 * When backend endpoint is deployed (e.g. GET /api/latest-updates),
 * verify or update this constant.
 */
export const LATEST_UPDATES_API_ENDPOINT = '/api/latest-updates';

/**
 * Fetches latest active notifications from the API.
 * Expected JSON Response format:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "notification-001",
 *       "title": "शिक्षा विभाग द्वारा नया आदेश जारी किया गया",
 *       "description": "नया सरकारी आदेश प्रकाशित हुआ है।",
 *       "type": "government_order",
 *       "createdAt": "2026-10-10T08:00:00.000Z",
 *       "link": "/government-orders/order-001",
 *       "enabled": true
 *     }
 *   ]
 * }
 */
export async function getLatestNotifications() {
  try {
    const API_BASE_URL = (
      import.meta.env.VITE_API_BASE_URL ||
      "https://haryana-info-api.linconbhalla007.workers.dev"
    ).replace(/\/+$/, "");

    const url = `${API_BASE_URL}${LATEST_UPDATES_API_ENDPOINT}`;
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      // Endpoint not yet active on backend, return empty array gracefully
      return [];
    }

    const res = await response.json();

    if (res && res.success && Array.isArray(res.data)) {
      return res.data;
    }
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  } catch (error) {
    // Graceful error logging when API endpoint is not yet live
    console.warn("Latest Updates API unreachable or not yet ready:", error.message);
    return [];
  }
}

export default {
  LATEST_UPDATES_API_ENDPOINT,
  getLatestNotifications,
};
