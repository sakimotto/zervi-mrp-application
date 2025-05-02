import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Tooltip,
  LinearProgress,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  Assignment as AssignmentIcon,
  QrCode as QrCodeIcon,
  History as HistoryIcon,
  LocalShipping as ShippingIcon,
  Category as CategoryIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  TimeScale
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
);

// Mock data for dashboard
const getMockDashboardData = () => {
  return {
    inventorySummary: {
      totalItems: 1248,
      totalValue: 287650.25,
      lowStockItems: 127,
      outOfStockItems: 18,
      warehouseCount: 5,
      batchCount: 342,
      serializedItems: 215
    },
    categoryBreakdown: {
      'Raw Material': 742,
      'Component': 325,
      'Finished Good': 108,
      'Packaging': 73
    },
    recentTransactions: [
      { id: 101, date: '2025-04-28', type: 'Received', item: 'Cotton Fabric - Blue', quantity: 150, reference: 'PO-1245', location: 'Warehouse A' },
      { id: 102, date: '2025-04-27', type: 'Consumed', item: 'Metal Buttons - Silver', quantity: -500, reference: 'MO-5680', location: 'Warehouse A' },
      { id: 103, date: '2025-04-27', type: 'Received', item: 'Zipper - White (30cm)', quantity: 1000, reference: 'PO-1242', location: 'Warehouse B' },
      { id: 104, date: '2025-04-26', type: 'Adjustment', item: 'Polyester Fabric - Blue', quantity: -25, reference: 'ADJ-128', location: 'Warehouse B' },
      { id: 105, date: '2025-04-25', type: 'Consumed', item: 'Care Labels - Standard', quantity: -2000, reference: 'MO-5675', location: 'Warehouse A' },
      { id: 106, date: '2025-04-25', type: 'Transfer', item: 'Leather - Black', quantity: -50, reference: 'TRF-089', location: 'Warehouse C to Warehouse A' },
      { id: 107, date: '2025-04-24', type: 'Received', item: 'Plastic Buttons - Blue', quantity: 2000, reference: 'PO-1240', location: 'Warehouse A' }
    ],
    lowStockAlerts: [
      { id: 1, sku: 'ZPR-001', name: 'Zipper - Black (20cm)', current: 750, minimum: 800, reorder: 1000, location: 'Warehouse A' },
      { id: 2, sku: 'THR-002', name: 'Thread - White', current: 85, minimum: 90, reorder: 110, location: 'Warehouse C' },
      { id: 3, sku: 'LTH-001', name: 'Leather - Black', current: 30, minimum: 35, reorder: 50, location: 'Warehouse B' },
      { id: 4, sku: 'BTN-005', name: 'Plastic Buttons - Blue', current: 520, minimum: 500, reorder: 750, location: 'Warehouse A' },
      { id: 5, sku: 'PKG-003', name: 'Packaging Boxes - Large', current: 125, minimum: 120, reorder: 200, location: 'Warehouse D' }
    ],
    warehouseUtilization: [
      { id: 'A', name: 'Warehouse A', used: 85, total: 100 },
      { id: 'B', name: 'Warehouse B', used: 72, total: 100 },
      { id: 'C', name: 'Warehouse C', used: 45, total: 100 },
      { id: 'D', name: 'Warehouse D', used: 63, total: 100 },
      { id: 'E', name: 'Warehouse E', used: 92, total: 100 }
    ],
    inventoryMovement: [
      { date: '2025-04-01', receipts: 2500, issues: 1800, adjustments: -50 },
      { date: '2025-04-02', receipts: 1200, issues: 1500, adjustments: 25 },
      { date: '2025-04-03', receipts: 3000, issues: 2200, adjustments: -75 },
      { date: '2025-04-04', receipts: 1800, issues: 1600, adjustments: 0 },
      { date: '2025-04-05', receipts: 900, issues: 1100, adjustments: 30 },
      { date: '2025-04-06', receipts: 0, issues: 800, adjustments: 0 },
      { date: '2025-04-07', receipts: 0, issues: 600, adjustments: -20 },
      { date: '2025-04-08', receipts: 4500, issues: 1200, adjustments: 0 },
      { date: '2025-04-09', receipts: 1200, issues: 1800, adjustments: 45 },
      { date: '2025-04-10', receipts: 2200, issues: 2000, adjustments: -30 },
      { date: '2025-04-11', receipts: 1500, issues: 1700, adjustments: 0 },
      { date: '2025-04-12', receipts: 800, issues: 900, adjustments: 0 },
      { date: '2025-04-13', receipts: 0, issues: 500, adjustments: 0 },
      { date: '2025-04-14', receipts: 0, issues: 400, adjustments: -15 },
      { date: '2025-04-15', receipts: 3800, issues: 1100, adjustments: 0 },
      { date: '2025-04-16', receipts: 1400, issues: 1600, adjustments: 25 },
      { date: '2025-04-17', receipts: 2000, issues: 1900, adjustments: -40 },
      { date: '2025-04-18', receipts: 1600, issues: 1500, adjustments: 0 },
      { date: '2025-04-19', receipts: 700, issues: 800, adjustments: 0 },
      { date: '2025-04-20', receipts: 0, issues: 400, adjustments: 0 },
      { date: '2025-04-21', receipts: 0, issues: 300, adjustments: -10 },
      { date: '2025-04-22', receipts: 4200, issues: 1000, adjustments: 0 },
      { date: '2025-04-23', receipts: 1300, issues: 1700, adjustments: 35 },
      { date: '2025-04-24', receipts: 2100, issues: 1800, adjustments: -25 },
      { date: '2025-04-25', receipts: 1400, issues: 1600, adjustments: 0 },
      { date: '2025-04-26', receipts: 600, issues: 700, adjustments: 0 },
      { date: '2025-04-27', receipts: 0, issues: 300, adjustments: 0 },
      { date: '2025-04-28', receipts: 0, issues: 200, adjustments: -5 },
      { date: '2025-04-29', receipts: 3500, issues: 900, adjustments: 0 },
      { date: '2025-04-30', receipts: 1100, issues: 1500, adjustments: 20 }
    ],
    expiringItems: [
      { id: 1, sku: 'FAB-001', name: 'Cotton Fabric - Blue', lotNumber: 'LOT-2025-01-15-001', expirationDate: '2025-07-15', daysRemaining: 75, location: 'Warehouse A' },
      { id: 2, sku: 'ADH-003', name: 'Adhesive Type B', lotNumber: 'LOT-2025-02-10-002', expirationDate: '2025-06-10', daysRemaining: 40, location: 'Warehouse C' },
      { id: 3, sku: 'CHM-005', name: 'Chemical Solution X', lotNumber: 'LOT-2025-03-05-001', expirationDate: '2025-05-05', daysRemaining: 5, location: 'Warehouse C' }
    ],
    inventoryAlerts: [
      { id: 1, type: 'low_stock', item: 'Zipper - Black (20cm)', message: 'Low stock level reached', createdAt: '2025-04-27', isAcknowledged: false },
      { id: 2, type: 'expiration', item: 'Chemical Solution X', message: 'Item expiring in 5 days', createdAt: '2025-04-28', isAcknowledged: false },
      { id: 3, type: 'quality_issue', item: 'Leather - Black', message: 'Quality check required for recent batch', createdAt: '2025-04-26', isAcknowledged: true },
      { id: 4, type: 'warehouse_capacity', item: 'Warehouse E', message: 'Warehouse capacity at 92%', createdAt: '2025-04-25', isAcknowledged: false }
    ]
  };
};

export default function EnhancedInventoryDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'quarter'
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const data = getMockDashboardData();
      setDashboardData(data);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const data = getMockDashboardData();
      setDashboardData(data);
      setLoading(false);
    }, 1000);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleViewAllItems = () => {
    navigate('/inventory/items');
  };

  const handleViewItem = (id) => {
    navigate(`/inventory/items/${id}`);
  };

  const handleAddItem = () => {
    navigate('/inventory/items/new');
  };

  const handleViewWarehouse = (id) => {
    navigate(`/inventory/warehouses/${id}`);
  };

  const handleViewWarehouses = () => {
    navigate('/inventory/warehouses');
  };

  const handleViewTransactions = () => {
    navigate('/inventory/transactions');
  };

  const handleViewBatches = () => {
    navigate('/inventory/batches');
  };

  const handleAcknowledgeAlert = (alertId) => {
    console.log(`Acknowledge alert ${alertId}`);
    // In a real implementation, this would call an API to acknowledge the alert
    const updatedAlerts = dashboardData.inventoryAlerts.map(alert => 
      alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
    );
    setDashboardData({
      ...dashboardData,
      inventoryAlerts: updatedAlerts
    });
    setSelectedAlert(null);
  };

  const getStatusColor = (current, minimum) => {
    return current < minimum ? 'error' : 'warning';
  };

  // Prepare chart data
  const getCategoryChartData = () => {
    if (!dashboardData) return null;
    
    return {
      labels: Object.keys(dashboardData.categoryBreakdown),
      datasets: [
        {
          label: 'Items by Category',
          data: Object.values(dashboardData.categoryBreakdown),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getWarehouseChartData = () => {
    if (!dashboardData) return null;
    
    return {
      labels: dashboardData.warehouseUtilization.map(wh => wh.name),
      datasets: [
        {
          label: 'Utilization (%)',
          data: dashboardData.warehouseUtilization.map(wh => wh.used),
          backgroundColor: dashboardData.warehouseUtilization.map(wh => 
            wh.used > 90 ? 'rgba(255, 99, 132, 0.7)' : 
            wh.used > 75 ? 'rgba(255, 159, 64, 0.7)' : 
            'rgba(75, 192, 192, 0.7)'
          ),
          borderColor: 'rgba(54, 162, 235, 0.5)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getInventoryMovementChartData = () => {
    if (!dashboardData) return null;
    
    // Filter data based on selected time range
    let filteredData = dashboardData.inventoryMovement;
    if (timeRange === 'week') {
      filteredData = filteredData.slice(-7);
    } else if (timeRange === 'month') {
      filteredData = filteredData.slice(-30);
    }
    
    return {
      labels: filteredData.map(item => item.date),
      datasets: [
        {
          label: 'Receipts',
          data: filteredData.map(item => item.receipts),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Issues',
          data: filteredData.map(item => item.issues),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Adjustments',
          data: filteredData.map(item => item.adjustments),
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4,
          fill: true,
          hidden: true // Hide by default as it can clutter the chart
        }
      ]
    };
  };

  const warehouseChartOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Utilization (%)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Warehouse Utilization'
      }
    },
    maintainAspectRatio: false
  };

  const inventoryMovementChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory Movement'
      }
    },
    maintainAspectRatio: false
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Inventory Dashboard
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Inventory Dashboard
        </Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
          >
            Add New Item
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h3">
                {dashboardData.inventorySummary.totalItems.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Across {dashboardData.inventorySummary.warehouseCount} warehouses
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleViewAllItems} endIcon={<ArrowForwardIcon />}>
                View All Items
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Inventory Value
              </Typography>
              <Typography variant="h3">
                ${dashboardData.inventorySummary.totalValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total value of all inventory items
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/inventory/reports/valuation')} endIcon={<ArrowForwardIcon />}>
                View Report
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h3" color="warning.main">
                {dashboardData.inventorySummary.lowStockItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Items below reorder point
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="warning"
                onClick={() => navigate('/inventory/items?filter=lowstock')}
                endIcon={<ArrowForwardIcon />}
              >
                View Low Stock
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h3" color="error.main">
                {dashboardData.inventorySummary.outOfStockItems}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Items with zero quantity
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="error"
                onClick={() => navigate('/inventory/items?filter=outofstock')}
                endIcon={<ArrowForwardIcon />}
              >
                View Out of Stock
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Dashboard Sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<InventoryIcon />} label="Overview" />
          <Tab icon={<HistoryIcon />} label="Movement History" />
          <Tab icon={<WarehouseIcon />} label="Warehouses" />
          <Tab 
            icon={
              <Badge badgeContent={dashboardData.inventoryAlerts.filter(a => !a.isAcknowledged).length} color="error">
                <NotificationsIcon />
              </Badge>
            } 
            label="Alerts" 
          />
        </Tabs>

        {/* Overview Tab */}
        <Box role="tabpanel" hidden={tabValue !== 0} sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {/* Left Column - Category Breakdown */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Items by Category
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <Pie data={getCategoryChartData()} />
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column - Warehouse Utilization */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Warehouse Utilization
                    </Typography>
                    <Button 
                      size="small"
                      endIcon={<ArrowForwardIcon />} 
                      onClick={handleViewWarehouses}
                    >
                      Manage Warehouses
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={getWarehouseChartData()} 
                      options={warehouseChartOptions} 
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Low Stock Alerts */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Low Stock Alerts
                    </Typography>
                    <Button 
                      size="small"
                      endIcon={<ArrowForwardIcon />} 
                      onClick={() => navigate('/inventory/items?filter=lowstock')}
                    >
                      View All
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {dashboardData.lowStockAlerts.length > 0 ? (
                    <List>
                      {dashboardData.lowStockAlerts.map((item) => (
                        <ListItem
                          key={item.id}
                          secondaryAction={
                            <Tooltip title="View Details">
                              <IconButton edge="end" onClick={() => handleViewItem(item.id)}>
                                <ArrowForwardIcon />
                              </IconButton>
                            </Tooltip>
                          }
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1
                          }}
                        >
                          <ListItemIcon>
                            <WarningIcon color={getStatusColor(item.current, item.minimum)} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" component="span">
                                  {item.name}
                                </Typography>
                                <Chip 
                                  label={item.sku} 
                                  size="small" 
                                  sx={{ ml: 1 }} 
                                />
                                <Chip 
                                  label={item.location} 
                                  size="small" 
                                  color="info"
                                  sx={{ ml: 1 }} 
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  Current: {item.current} | Minimum: {item.minimum} | Reorder: {item.reorder}
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(item.current / item.reorder) * 100} 
                                  sx={{ 
                                    mt: 1,
                                    height: 8,
                                    borderRadius: 1,
                                    bgcolor: 'background.paper',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: item.current < item.minimum ? 'error.main' : 'warning.main'
                                    }
                                  }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="success">No low stock items detected</Alert>
                  )}
                </Paper>
              </Grid>

              {/* Recent Transactions */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Recent Transactions
                    </Typography>
                    <Button 
                      size="small"
                      endIcon={<ArrowForwardIcon />} 
                      onClick={handleViewTransactions}
                    >
                      View All
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer sx={{ maxHeight: 350 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell>Location</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.recentTransactions.map((transaction) => (
                          <TableRow key={transaction.id} hover>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>
                              <Chip 
                                label={transaction.type} 
                                color={
                                  transaction.type === 'Received' ? 'success' : 
                                  transaction.type === 'Consumed' ? 'primary' :
                                  transaction.type === 'Adjustment' ? 'warning' :
                                  transaction.type === 'Transfer' ? 'info' :
                                  'default'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{transaction.item}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: transaction.quantity > 0 ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}>
                              {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                            </TableCell>
                            <TableCell>{transaction.location}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Movement History Tab */}
        <Box role="tabpanel" hidden={tabValue !== 1} sx={{ p: 3 }}>
          {tabValue === 1 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Inventory Movement History
                </Typography>
                <Box>
                  <Button
                    size="small"
                    endIcon={<FilterListIcon />}
                    onClick={handleMenuOpen}
                    sx={{ mr: 1 }}
                  >
                    {timeRange === 'week' ? 'Last 7 Days' : 
                     timeRange === 'month' ? 'Last 30 Days' : 
                     'Last Quarter'}
                  </Button>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleTimeRangeChange('week')}>Last 7 Days</MenuItem>
                    <MenuItem onClick={() => handleTimeRangeChange('month')}>Last 30 Days</MenuItem>
                    <MenuItem onClick={() => handleTimeRangeChange('quarter')}>Last Quarter</MenuItem>
                  </Menu>
                  <Button 
                    size="small"
                    endIcon={<ArrowForwardIcon />} 
                    onClick={handleViewTransactions}
                  >
                    View All Transactions
                  </Button>
                </Box>
              </Box>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ height: 400 }}>
                  <Line 
                    data={getInventoryMovementChartData()} 
                    options={inventoryMovementChartOptions} 
                  />
                </Box>
              </Paper>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Expiring Items
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Lot Number</TableCell>
                            <TableCell>Expiration Date</TableCell>
                            <TableCell>Days Left</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboardData.expiringItems.map((item) => (
                            <TableRow key={item.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  {item.name}
                                  <Typography variant="caption" color="text.secondary">
                                    {item.sku}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{item.lotNumber}</TableCell>
                              <TableCell>{item.expirationDate}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={`${item.daysRemaining} days`} 
                                  color={
                                    item.daysRemaining <= 7 ? 'error' :
                                    item.daysRemaining <= 30 ? 'warning' :
                                    'success'
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{item.location}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Batch/Lot Tracking
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" color="primary.main" gutterBottom>
                          {dashboardData.inventorySummary.batchCount}
                        </Typography>
                        <Typography variant="body1">
                          Active Batches/Lots
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary"
                          startIcon={<QrCodeIcon />}
                          sx={{ mt: 2 }}
                          onClick={handleViewBatches}
                        >
                          Manage Batches
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Box>

        {/* Warehouses Tab */}
        <Box role="tabpanel" hidden={tabValue !== 2} sx={{ p: 3 }}>
          {tabValue === 2 && (
            <Grid container spacing={3}>
              {dashboardData.warehouseUtilization.map((warehouse) => (
                <Grid item xs={12} md={6} key={warehouse.id}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {warehouse.name}
                      </Typography>
                      <Button 
                        size="small"
                        endIcon={<ArrowForwardIcon />} 
                        onClick={() => handleViewWarehouse(warehouse.id)}
                      >
                        View Details
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Utilization
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={warehouse.used} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              bgcolor: 'background.paper',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: 
                                  warehouse.used > 90 ? 'error.main' :
                                  warehouse.used > 75 ? 'warning.main' :
                                  'success.main'
                              }
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {warehouse.used}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Used: {warehouse.used}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available: {100 - warehouse.used}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Alerts Tab */}
        <Box role="tabpanel" hidden={tabValue !== 3} sx={{ p: 3 }}>
          {tabValue === 3 && (
            <Grid container spacing={3}>
              {dashboardData.inventoryAlerts.map((alert) => (
                <Grid item xs={12} md={6} key={alert.id}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      borderLeft: '4px solid',
                      borderColor: 
                        alert.type === 'low_stock' ? 'warning.main' :
                        alert.type === 'expiration' ? 'error.main' :
                        alert.type === 'quality_issue' ? 'info.main' :
                        'primary.main',
                      opacity: alert.isAcknowledged ? 0.7 : 1
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          {alert.item}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Created: {alert.createdAt}
                        </Typography>
                      </Box>
                      <Box>
                        {alert.isAcknowledged ? (
                          <Chip label="Acknowledged" size="small" color="default" />
                        ) : (
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
}