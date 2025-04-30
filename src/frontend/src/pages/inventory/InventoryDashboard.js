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
  CircularProgress
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
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Mock data for dashboard
const getMockDashboardData = () => {
  return {
    inventorySummary: {
      totalItems: 1248,
      totalValue: 287650.25,
      lowStockItems: 127,
      outOfStockItems: 18,
      warehouseCount: 5
    },
    categoryBreakdown: {
      'Raw Material': 742,
      'Component': 325,
      'Finished Good': 108,
      'Packaging': 73
    },
    recentTransactions: [
      { id: 101, date: '2025-04-28', type: 'Received', item: 'Cotton Fabric - Black', quantity: 150, reference: 'PO-1245' },
      { id: 102, date: '2025-04-27', type: 'Consumed', item: 'Metal Buttons - Silver', quantity: -500, reference: 'MO-5680' },
      { id: 103, date: '2025-04-27', type: 'Received', item: 'Zipper - White (30cm)', quantity: 1000, reference: 'PO-1242' },
      { id: 104, date: '2025-04-26', type: 'Inventory Adjustment', item: 'Polyester Fabric - Blue', quantity: -25, reference: 'ADJ-128' },
      { id: 105, date: '2025-04-25', type: 'Consumed', item: 'Care Labels - Standard', quantity: -2000, reference: 'MO-5675' }
    ],
    lowStockAlerts: [
      { id: 1, sku: 'ZPR-001', name: 'Zipper - Black (20cm)', current: 750, minimum: 800, reorder: 1000 },
      { id: 2, sku: 'THR-002', name: 'Thread - White', current: 85, minimum: 90, reorder: 110 },
      { id: 3, sku: 'LTH-001', name: 'Leather - Black', current: 30, minimum: 35, reorder: 50 },
      { id: 4, sku: 'BTN-005', name: 'Plastic Buttons - Blue', current: 520, minimum: 500, reorder: 750 },
      { id: 5, sku: 'PKG-003', name: 'Packaging Boxes - Large', current: 125, minimum: 120, reorder: 200 }
    ],
    warehouseUtilization: [
      { id: 'A', name: 'Warehouse A', used: 85, total: 100 },
      { id: 'B', name: 'Warehouse B', used: 72, total: 100 },
      { id: 'C', name: 'Warehouse C', used: 45, total: 100 },
      { id: 'D', name: 'Warehouse D', used: 63, total: 100 },
      { id: 'E', name: 'Warehouse E', used: 92, total: 100 }
    ]
  };
};

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

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

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Category Breakdown */}
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

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          {/* Warehouse Utilization */}
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
                onClick={() => navigate('/inventory/transactions')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {dashboardData.recentTransactions.map((transaction) => (
                <ListItem
                  key={transaction.id}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemIcon>
                    {transaction.type === 'Received' ? (
                      <TrendingUpIcon color="success" />
                    ) : transaction.type === 'Consumed' ? (
                      <TrendingDownIcon color="primary" />
                    ) : (
                      <AssignmentIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" component="span">
                          {transaction.item}
                        </Typography>
                        <Chip 
                          label={transaction.type} 
                          size="small" 
                          color={
                            transaction.type === 'Received' ? 'success' : 
                            transaction.type === 'Consumed' ? 'primary' : 
                            'warning'
                          }
                          sx={{ ml: 1 }} 
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" component="span" color="text.secondary">
                          {transaction.date} | Ref: {transaction.reference} | 
                          <Typography 
                            component="span" 
                            color={transaction.quantity > 0 ? 'success.main' : 'error.main'}
                            sx={{ fontWeight: 'bold', ml: 1 }}
                          >
                            {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                          </Typography>
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
