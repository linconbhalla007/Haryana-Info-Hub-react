/**
 * Public Service Component for Government Jobs (सरकारी भर्तियाँ एवं रोजगार जानकारी).
 * Connects to the Cloudflare Worker API.
 * Endpoints:
 * - GET /api/jobs (List with pagination)
 * - GET /api/jobs/:id (Details)
 * - GET /api/download-job/:id (Direct PDF Download)
 */
import {
  getGovernmentJobs as fetchGovernmentJobsApi,
  getGovernmentJob as fetchGovernmentJobByIdApi,
} from '../admin/services/adminApi.js';
import { downloadJobPdf as downloadJobPdfHelper } from '../utils/downloadHelper.js';

/**
 * Fetches paginated government jobs from Cloudflare API.
 * GET /api/jobs?page=X&limit=Y
 */
export function getJobs(page = 1, limit = 15) {
  return fetchGovernmentJobsApi(page, limit);
}

/**
 * Fetches all jobs for search/filters.
 */
export function getAllJobs() {
  return fetchGovernmentJobsApi(1, 100).then((res) => res.data || []);
}

/**
 * Retrieves a single government job by ID from Cloudflare API.
 * GET /api/jobs/:id
 */
export function getJobById(id) {
  return fetchGovernmentJobByIdApi(id);
}

/**
 * Downloads a government job PDF notification via the download endpoint.
 */
export function downloadJob(id, title, fallbackPdfUrl) {
  return downloadJobPdfHelper(id, title, fallbackPdfUrl);
}

export default {
  getJobs,
  getAllJobs,
  getJobById,
  downloadJob,
};
