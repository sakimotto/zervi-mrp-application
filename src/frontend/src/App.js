import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';

// Division-specific dashboards
import AutomotiveDashboard from './pages/divisions/AutomotiveDashboard';
import CampingDashboard from './pages/divisions/CampingDashboard';
import ApparelDashboard from './pages/divisions/ApparelDashboard';
import ZervitekDashboard from './pages/divisions/ZervitekDashboard';

// Inventory management
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import InventoryListPage from './pages/inventory/InventoryListPage';
import ItemDetailsPage from './pages/inventory/ItemDetailsPage';
import ItemFormPage from './pages/inventory/ItemFormPage';
import BatchManagementPage from './pages/inventory/BatchManagementPage';
import WarehousesPage from './pages/inventory/WarehousesPage';

// BOM management
import BomListPage from './pages/bom/BomListPage';
import BomDetailsPage from './pages/bom/BomDetailsPage';

// Manufacturing
import ManufacturingOrdersPage from './pages/manufacturing/ManufacturingOrdersPage';
import ManufacturingOrderDetailsPage from './pages/manufacturing/ManufacturingOrderDetailsPage';
import ProductionSchedulePage from './pages/manufacturing/ProductionSchedulePage';

// Specialized Operations
import LaminatingOperationsPage from './pages/operations/LaminatingOperationsPage';
import CuttingOperationsPage from './pages/operations/CuttingOperationsPage';
import SewingOperationsPage from './pages/operations/SewingOperationsPage';
import EmbroideryOperationsPage from './pages/operations/EmbroideryOperationsPage';

// Inter-division transfers
import TransfersListPage from './pages/transfers/TransfersListPage';
import TransferDetailsPage from './pages/transfers/TransferDetailsPage';

// Sales
import CustomerOrdersPage from './pages/sales/CustomerOrdersPage';
import CustomerOrderDetailsPage from './pages/sales/CustomerOrderDetailsPage';
import CustomersPage from './pages/sales/CustomersPage';

// Procurement
import PurchaseOrdersPage from './pages/procurement/PurchaseOrdersPage';
import PurchaseOrderDetailsPage from './pages/procurement/PurchaseOrderDetailsPage';
import SuppliersPage from './pages/procurement/SuppliersPage';

// Costing
import CostingPage from './pages/costing/CostingPage';
import PricingScenariosPage from './pages/costing/PricingScenariosPage';

// Settings
import SettingsPage from './pages/settings/SettingsPage';
import UsersPage from './pages/settings/UsersPage';
import DivisionsPage from './pages/settings/DivisionsPage';

// Error pages
import NotFoundPage from './pages/errors/NotFoundPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Temporary: Bypass authentication for development
  // REMOVE THIS FOR PRODUCTION
  return children;

  /* Original authentication logic - uncomment when ready
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
  */
};

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Division-specific dashboards */}
        <Route path="/divisions/automotive" element={<AutomotiveDashboard />} />
        <Route path="/divisions/camping" element={<CampingDashboard />} />
        <Route path="/divisions/apparel" element={<ApparelDashboard />} />
        <Route path="/divisions/zervitek" element={<ZervitekDashboard />} />

        {/* Inventory management */}
        <Route path="/inventory" element={<InventoryDashboard />} />
        <Route path="/inventory/items" element={<InventoryListPage />} />
        <Route path="/inventory/items/new" element={<ItemFormPage />} />
        <Route path="/inventory/items/:id" element={<ItemDetailsPage />} />
        <Route path="/inventory/items/:id/edit" element={<ItemFormPage />} />
        <Route path="/inventory/items/:id/batches" element={<BatchManagementPage />} />
        <Route path="/inventory/warehouses" element={<WarehousesPage />} />

        {/* BOM management */}
        <Route path="/boms" element={<BomListPage />} />
        <Route path="/boms/:id" element={<BomDetailsPage />} />

        {/* Manufacturing */}
        <Route path="/manufacturing/orders" element={<ManufacturingOrdersPage />} />
        <Route path="/manufacturing/orders/:id" element={<ManufacturingOrderDetailsPage />} />
        <Route path="/manufacturing/schedule" element={<ProductionSchedulePage />} />

        {/* Specialized Operations */}
        <Route path="/operations/laminating" element={<LaminatingOperationsPage />} />
        <Route path="/operations/cutting" element={<CuttingOperationsPage />} />
        <Route path="/operations/sewing" element={<SewingOperationsPage />} />
        <Route path="/operations/embroidery" element={<EmbroideryOperationsPage />} />

        {/* Inter-division transfers */}
        <Route path="/transfers" element={<TransfersListPage />} />
        <Route path="/transfers/:id" element={<TransferDetailsPage />} />

        {/* Sales */}
        <Route path="/sales/orders" element={<CustomerOrdersPage />} />
        <Route path="/sales/orders/:id" element={<CustomerOrderDetailsPage />} />
        <Route path="/sales/customers" element={<CustomersPage />} />

        {/* Procurement */}
        <Route path="/procurement/orders" element={<PurchaseOrdersPage />} />
        <Route path="/procurement/orders/:id" element={<PurchaseOrderDetailsPage />} />
        <Route path="/procurement/suppliers" element={<SuppliersPage />} />

        {/* Costing */}
        <Route path="/costing" element={<CostingPage />} />
        <Route path="/costing/pricing-scenarios" element={<PricingScenariosPage />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/users" element={<UsersPage />} />
        <Route path="/settings/divisions" element={<DivisionsPage />} />
      </Route>

      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
