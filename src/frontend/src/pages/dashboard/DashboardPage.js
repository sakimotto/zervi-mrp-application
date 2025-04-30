import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CardHeader, Divider, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const DashboardPage = () => {
  const { currentUser, currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    inventorySummary: { totalItems: 0, lowStock: 0, outOfStock: 0 },
    manufacturingOrders: { total: 0, inProgress: 0, completed: 0, delayed: 0 },
    customerOrders: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    purchaseOrders: { total: 0, pending: 0, received: 0 },
    transfers: { incoming: 0, outgoing: 0 }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch actual data from the backend
        // For now, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in real implementation, this would come from API
        const mockData = {
          inventorySummary: { totalItems: 1248, lowStock: 32, outOfStock: 8 },
          manufacturingOrders: { total: 56, inProgress: 24, completed: 28, delayed: 4 },
          customerOrders: { total: 38, pending: 12, inProgress: 18, completed: 8 },
          purchaseOrders: { total: 22, pending: 14, received: 8 },
          transfers: { incoming: 6, outgoing: 9 }
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentDivision]);

  const navigateTo = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {currentDivision ? `${currentDivision.name} Dashboard` : 'Main Dashboard'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Welcome back, {currentUser?.name || 'User'}. Here's an overview of your manufacturing operations.
      </Typography>

      <Grid container spacing={3}>
        {/* Inventory Summary */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader 
              title="Inventory Summary" 
              avatar={<InventoryIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/inventory')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="h5" align="center">{dashboardData.inventorySummary.totalItems}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Total Items</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" align="center" color="warning.main">{dashboardData.inventorySummary.lowStock}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Low Stock</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" align="center" color="error.main">{dashboardData.inventorySummary.outOfStock}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Out of Stock</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Manufacturing Orders */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader 
              title="Manufacturing Orders" 
              avatar={<FactoryIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/manufacturing/orders')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center">{dashboardData.manufacturingOrders.total}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Total</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="info.main">{dashboardData.manufacturingOrders.inProgress}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">In Progress</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="success.main">{dashboardData.manufacturingOrders.completed}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Completed</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="error.main">{dashboardData.manufacturingOrders.delayed}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Delayed</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Orders */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader 
              title="Customer Orders" 
              avatar={<ShoppingCartIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/sales/orders')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center">{dashboardData.customerOrders.total}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Total</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="warning.main">{dashboardData.customerOrders.pending}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Pending</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="info.main">{dashboardData.customerOrders.inProgress}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">In Progress</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="success.main">{dashboardData.customerOrders.completed}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Completed</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Purchase Orders */}
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <CardHeader 
              title="Purchase Orders" 
              avatar={<LocalShippingIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/procurement/orders')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="h5" align="center">{dashboardData.purchaseOrders.total}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Total</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" align="center" color="warning.main">{dashboardData.purchaseOrders.pending}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Pending</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" align="center" color="success.main">{dashboardData.purchaseOrders.received}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Received</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Inter-Division Transfers */}
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <CardHeader 
              title="Inter-Division Transfers" 
              avatar={<SwapHorizIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/transfers')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h5" align="center" color="info.main">{dashboardData.transfers.incoming}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Incoming Transfers</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5" align="center" color="warning.main">{dashboardData.transfers.outgoing}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Outgoing Transfers</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
