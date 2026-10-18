/**
 * Public Service Component for Employee Proformas.
 * Uses the exact same Cloudflare Worker API as the admin section.
 * Endpoints:
 * - GET /api/proformas (List)
 * - GET /api/proformas/:id (Details)
 * - GET /api/download-proforma/:id (Download PDF)
 */
import {
  getEmployeeProformas as fetchEmployeeProformasApi,
  getEmployeeProforma as fetchEmployeeProformaByIdApi,
} from '../admin/services/adminApi.js';
import { downloadProformaPdf as downloadProformaPdfHelper } from '../utils/downloadHelper.js';

/**
 * Resolves PDF URL directly from Cloudflare R2 / API response.
 */
export function getPdfUrl(path) {
  return path || "";
}

/**
 * Fetches paginated employee proformas from Cloudflare API.
 * GET /api/proformas?page=X&limit=Y
 */
export function getEmployeeProformas(page = 1, limit = 15) {
  return fetchEmployeeProformasApi(page, limit);
}

/**
 * Fetches all employee proformas from Cloudflare API for search/filters.
 */
export function getAllEmployeeProformas() {
  return fetchEmployeeProformasApi(1, 100).then((res) => res.data || []);
}

/**
 * Retrieves a single employee proforma by ID from Cloudflare API.
 * GET /api/proformas/:id
 */
export function getEmployeeProformaById(id) {
  return fetchEmployeeProformaByIdApi(id);
}

/**
 * Downloads an employee proforma PDF via the download endpoint.
 */
export function downloadProforma(id, title, fallbackPdfUrl) {
  return downloadProformaPdfHelper(id, title, fallbackPdfUrl);
}

export default {
  getPdfUrl,
  getEmployeeProformas,
  getAllEmployeeProformas,
  getEmployeeProformaById,
  downloadProforma,
};
