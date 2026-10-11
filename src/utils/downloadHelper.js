import { API_BASE_URL } from '../admin/services/adminApi.js';

/**
 * Downloads a government order PDF using the dedicated API endpoint:
 * GET ${API_BASE_URL}/api/download-order/:id
 *
 * Headers returned by API:
 * - Content-Type: application/pdf
 * - Content-Disposition: attachment; filename="<Order Title>.pdf"
 * - Access-Control-Allow-Origin: *
 *
 * @param {string} orderId - e.g. "order-030"
 * @param {string} [orderTitle] - Optional order title for filename fallback
 * @param {string} [fallbackPdfUrl] - Optional direct R2/CDN URL fallback
 */
export async function downloadOrderPdf(orderId, orderTitle = 'haryana-order', fallbackPdfUrl = null) {
  if (!orderId && !fallbackPdfUrl) {
    throw new Error('ऑर्डर आईडी या PDF लिंक मौजूद नहीं है।');
  }

  const endpointUrl = orderId
    ? `${API_BASE_URL}/api/download-order/${encodeURIComponent(orderId)}`
    : fallbackPdfUrl;

  const safeTitle = (orderTitle || 'haryana-government-order')
    .replace(/[/\\?%*:|"<>]/g, '-')
    .trim();
  let filename = `${safeTitle}.pdf`;

  let response;
  try {
    response = await fetch(endpointUrl, {
      method: 'GET',
      mode: 'cors',
    });
  } catch (netErr) {
    // If download endpoint fails due to network or CORS, attempt fallback
    if (fallbackPdfUrl && fallbackPdfUrl !== endpointUrl) {
      try {
        response = await fetch(fallbackPdfUrl, { method: 'GET', mode: 'cors' });
      } catch {
        throw new Error('नेटवर्क त्रुटि: सर्वर से कनेक्ट करने में असमर्थ।');
      }
    } else {
      throw new Error('नेटवर्क त्रुटि: डाउनलोड सर्वर से कनेक्ट नहीं हो सका।');
    }
  }

  // Check if response is not ok or is JSON error
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  if (!response.ok || contentType.includes('application/json')) {
    let errMsg = 'PDF डाउनलोड करने में असमर्थ।';
    try {
      const data = await response.json();
      if (data && data.message) errMsg = data.message;
    } catch {}

    // If API returned error/404 but fallback direct URL exists, try downloading from fallback
    if (fallbackPdfUrl && fallbackPdfUrl !== endpointUrl) {
      try {
        const fbRes = await fetch(fallbackPdfUrl, { method: 'GET', mode: 'cors' });
        if (fbRes.ok && (fbRes.headers.get('content-type') || '').includes('application/pdf')) {
          const blob = await fbRes.blob();
          triggerBlobDownload(blob, filename);
          return;
        }
      } catch {}
    }

    throw new Error(errMsg || 'PDF फ़ाइल उपलब्ध नहीं है या डाउनलोड विफल रहा।');
  }

  // Parse filename from Content-Disposition header if returned by API
  const disposition = response.headers.get('content-disposition');
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match && match[1]) {
      const parsed = match[1].replace(/['"]/g, '').trim();
      if (parsed) filename = parsed;
    }
  }

  const blob = await response.blob();
  triggerBlobDownload(blob, filename);
}

/**
 * Triggers native browser file download using local Blob URL
 */
function triggerBlobDownload(blob, filename) {
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  }, 200);
}

/**
 * General file download utility for backward compatibility
 */
export async function downloadFile(url, defaultFilename = 'haryana-government-order.pdf') {
  return downloadOrderPdf(null, defaultFilename, url);
}

export default {
  downloadOrderPdf,
  downloadFile,
};
