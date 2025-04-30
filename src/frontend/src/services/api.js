import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api'
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/v1/auth/login', { email, password }),
  refreshToken: () => api.post('/api/v1/auth/refresh-token')
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  getUserDivisions: (userId) => api.get(`/users/${userId}/divisions`),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// Division API
export const divisionAPI = {
  getAllDivisions: () => api.get('/divisions'),
  getDivisionById: (id) => api.get(`/divisions/${id}`),
  createDivision: (divisionData) => api.post('/divisions', divisionData),
  updateDivision: (id, divisionData) => api.put(`/divisions/${id}`, divisionData),
  deleteDivision: (id) => api.delete(`/divisions/${id}`)
};

// Item API
export const itemAPI = {
  getAllItems: (params) => api.get('/items', { params }),
  getItemById: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => api.post('/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}`)
};

// BOM API
export const bomAPI = {
  getAllBoms: (params) => api.get('/boms', { params }),
  getBomById: (id) => api.get(`/boms/${id}`),
  createBom: (bomData) => api.post('/boms', bomData),
  updateBom: (id, bomData) => api.put(`/boms/${id}`, bomData),
  deleteBom: (id) => api.delete(`/boms/${id}`),
  addBomComponent: (id, componentData) => api.post(`/boms/${id}/components`, componentData),
  updateBomComponent: (id, componentId, componentData) => api.put(`/boms/${id}/components/${componentId}`, componentData),
  deleteBomComponent: (id, componentId) => api.delete(`/boms/${id}/components/${componentId}`)
};

// Manufacturing Order API
export const manufacturingOrderAPI = {
  getAllManufacturingOrders: (params) => api.get('/manufacturing-orders', { params }),
  getManufacturingOrderById: (id) => api.get(`/manufacturing-orders/${id}`),
  createManufacturingOrder: (orderData) => api.post('/manufacturing-orders', orderData),
  updateManufacturingOrder: (id, orderData) => api.put(`/manufacturing-orders/${id}`, orderData),
  deleteManufacturingOrder: (id) => api.delete(`/manufacturing-orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/manufacturing-orders/${id}/status`, { status }),
  addOperation: (id, operationData) => api.post(`/manufacturing-orders/${id}/operations`, operationData),
  updateOperation: (id, operationId, operationData) => api.put(`/manufacturing-orders/${id}/operations/${operationId}`, operationData),
  deleteOperation: (id, operationId) => api.delete(`/manufacturing-orders/${id}/operations/${operationId}`)
};

// Specialized Operations API
export const specializedOperationsAPI = {
  // Laminating
  getAllLaminatingOperations: (params) => api.get('/laminating-operations', { params }),
  getLaminatingOperationById: (id) => api.get(`/laminating-operations/${id}`),
  createLaminatingOperation: (operationData) => api.post('/laminating-operations', operationData),
  updateLaminatingOperation: (id, operationData) => api.put(`/laminating-operations/${id}`, operationData),
  
  // Cutting
  getAllCuttingOperations: (params) => api.get('/cutting-operations', { params }),
  getCuttingOperationById: (id) => api.get(`/cutting-operations/${id}`),
  createCuttingOperation: (operationData) => api.post('/cutting-operations', operationData),
  updateCuttingOperation: (id, operationData) => api.put(`/cutting-operations/${id}`, operationData),
  
  // Sewing
  getAllSewingOperations: (params) => api.get('/sewing-operations', { params }),
  getSewingOperationById: (id) => api.get(`/sewing-operations/${id}`),
  createSewingOperation: (operationData) => api.post('/sewing-operations', operationData),
  updateSewingOperation: (id, operationData) => api.put(`/sewing-operations/${id}`, operationData),
  
  // Embroidery
  getAllEmbroideryOperations: (params) => api.get('/embroidery-operations', { params }),
  getEmbroideryOperationById: (id) => api.get(`/embroidery-operations/${id}`),
  createEmbroideryOperation: (operationData) => api.post('/embroidery-operations', operationData),
  updateEmbroideryOperation: (id, operationData) => api.put(`/embroidery-operations/${id}`, operationData)
};

// Inter-Division Transfer API
export const transferAPI = {
  getAllTransfers: (params) => api.get('/inter-division-transfers', { params }),
  getTransferById: (id) => api.get(`/inter-division-transfers/${id}`),
  createTransfer: (transferData) => api.post('/inter-division-transfers', transferData),
  updateTransfer: (id, transferData) => api.put(`/inter-division-transfers/${id}`, transferData),
  deleteTransfer: (id) => api.delete(`/inter-division-transfers/${id}`),
  processTransfer: (id) => api.post(`/inter-division-transfers/${id}/process`),
  cancelTransfer: (id) => api.post(`/inter-division-transfers/${id}/cancel`)
};

// Customer Order API
export const customerOrderAPI = {
  getAllOrders: (params) => api.get('/customer-orders', { params }),
  getOrderById: (id) => api.get(`/customer-orders/${id}`),
  createOrder: (orderData) => api.post('/customer-orders', orderData),
  updateOrder: (id, orderData) => api.put(`/customer-orders/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/customer-orders/${id}`),
  createManufacturingOrders: (id) => api.post(`/customer-orders/${id}/create-manufacturing-orders`),
  cancelOrder: (id) => api.post(`/customer-orders/${id}/cancel`)
};

// Purchase Order API
export const purchaseOrderAPI = {
  getAllOrders: (params) => api.get('/purchase-orders', { params }),
  getOrderById: (id) => api.get(`/purchase-orders/${id}`),
  createOrder: (orderData) => api.post('/purchase-orders', orderData),
  updateOrder: (id, orderData) => api.put(`/purchase-orders/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/purchase-orders/${id}`),
  sendOrder: (id) => api.post(`/purchase-orders/${id}/send`),
  cancelOrder: (id) => api.post(`/purchase-orders/${id}/cancel`)
};

// Costing API
export const costingAPI = {
  getAllItemCosts: (params) => api.get('/item-costs', { params }),
  getItemCostById: (id) => api.get(`/item-costs/${id}`),
  createItemCost: (costData) => api.post('/item-costs', costData),
  updateItemCost: (id, costData) => api.put(`/item-costs/${id}`, costData),
  deleteItemCost: (id) => api.delete(`/item-costs/${id}`),
  getAllPricingScenarios: (params) => api.get('/pricing-scenarios', { params }),
  getPricingScenarioById: (id) => api.get(`/pricing-scenarios/${id}`),
  createPricingScenario: (scenarioData) => api.post('/pricing-scenarios', scenarioData),
  updatePricingScenario: (id, scenarioData) => api.put(`/pricing-scenarios/${id}`, scenarioData),
  deletePricingScenario: (id) => api.delete(`/pricing-scenarios/${id}`),
  calculateItemPrice: (calculationData) => api.post('/calculate-price', calculationData)
};

// Dashboard API
export const dashboardAPI = {
  getMainDashboardData: () => api.get('/dashboard'),
  getDivisionDashboardData: (divisionId) => api.get(`/dashboard/division/${divisionId}`)
};

export default {
  auth: authAPI,
  user: userAPI,
  division: divisionAPI,
  item: itemAPI,
  bom: bomAPI,
  manufacturingOrder: manufacturingOrderAPI,
  specializedOperations: specializedOperationsAPI,
  transfer: transferAPI,
  customerOrder: customerOrderAPI,
  purchaseOrder: purchaseOrderAPI,
  costing: costingAPI,
  dashboard: dashboardAPI
};
