export const API_BASE_URL = 'http://localhost:8081/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  AUTH_RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  ADMIN_RH: `${API_BASE_URL}/admin/rh`,
  ADMIN_PROFILE: `${API_BASE_URL}/admin/profile`,
  EMPLOYES: `${API_BASE_URL}/employes`,
  RESPONSABLES_RH: `${API_BASE_URL}/responsables-rh`,
  EXTERNAL_COMPANIES: `${API_BASE_URL}/external-companies`,
  EVENTS: `${API_BASE_URL}/events`,
  ACTIVITIES: `${API_BASE_URL}/activities`,
  FEEDBACKS: `${API_BASE_URL}/feedbacks`,
  IMAGES: `${API_BASE_URL}/images`,
  PARTICIPATIONS: `${API_BASE_URL}/participations`,
  PENDING_ACCOUNTS: `${API_BASE_URL}/pending-accounts`,
  DASHBOARD_STATS: `${API_BASE_URL}/dashboard/stats`,
};
