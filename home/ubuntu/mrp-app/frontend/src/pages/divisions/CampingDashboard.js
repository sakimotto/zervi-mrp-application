import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CardHeader, Divider, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const CampingDashboard = () => {
  const { currentUser, currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    inventorySummary: { totalItems: 0, lowStock: 0, outOfStock: 0 },
    manufacturingOrders: { total: 0, inProgress: 0, completed: 0, delayed: 0 },
    customerOrders: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    incomingTransfers: { total: 0, pending: 0, received: 0 },
    productionSummary: { 
      tents: { daily: 0, weekly: 0, monthly: 0 },
      sleepingBags: { daily: 0, weekly: 0, monthly: 0 },
      campingAccessories: { daily: 0, weekly: 0, monthly: 0 }
    }
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
          inventorySummary: { totalItems: 945, lowStock: 28, outOfStock: 7 },
          manufacturingOrders: { total: 48, inProgress: 22, completed: 24, delayed: 2 },
          customerOrders: { total: 32, pending: 10, inProgress: 15, completed: 7 },
          incomingTransfers: { total: 15, pending: 6, received: 9 },
          productionSummary: { 
            tents: { daily: 85, weekly: 595, monthly: 2550 },
            sleepingBags: { daily: 120, weekly: 840, monthly: 3600 },
            campingAccessories: { daily: 150, weekly: 1050, monthly: 4500 }
          }
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        Camping Production Division Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Camping and Outdoor Products
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

        {/* Incoming Transfers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Incoming Transfers from Zervitek" 
              subheader="Semi-finished materials for production"
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
                <Grid item xs={4}>
                  <Typography variant="h5" align="center">{dashboardData.incomingTransfers.total}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Total</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" align="center" color="warning.main">{dashboardData.incomingTransfers.pending}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Pending</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" align="center" color="success.main">{dashboardData.incomingTransfers.received}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Received</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Production Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Production Summary" 
              avatar={<OutdoorGrillIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/manufacturing/schedule')}>
                  View Schedule
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Tents</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.tents.daily}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Daily</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.tents.weekly}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Weekly</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.tents.monthly}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Monthly</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Sleeping Bags</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.sleepingBags.daily}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Daily</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.sleepingBags.weekly}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Weekly</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.sleepingBags.monthly}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Monthly</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CampingDashboard;
