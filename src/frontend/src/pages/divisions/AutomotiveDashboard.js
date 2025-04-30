import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CardHeader, Divider, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const AutomotiveDashboard = () => {
  const { currentUser, currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    inventorySummary: { totalItems: 0, lowStock: 0, outOfStock: 0 },
    manufacturingOrders: { total: 0, inProgress: 0, completed: 0, delayed: 0 },
    customerOrders: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    incomingTransfers: { total: 0, pending: 0, received: 0 },
    productionSummary: { 
      seatCovers: { daily: 0, weekly: 0, monthly: 0 },
      floorMats: { daily: 0, weekly: 0, monthly: 0 },
      otherProducts: { daily: 0, weekly: 0, monthly: 0 }
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
          inventorySummary: { totalItems: 1248, lowStock: 32, outOfStock: 8 },
          manufacturingOrders: { total: 56, inProgress: 24, completed: 28, delayed: 4 },
          customerOrders: { total: 38, pending: 12, inProgress: 18, completed: 8 },
          incomingTransfers: { total: 18, pending: 7, received: 11 },
          productionSummary: { 
            seatCovers: { daily: 180, weekly: 1260, monthly: 5400 },
            floorMats: { daily: 220, weekly: 1540, monthly: 6600 },
            otherProducts: { daily: 85, weekly: 595, monthly: 2550 }
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
        Automotive Division Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Neoprene Interior Protection Products
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
              avatar={<DirectionsCarIcon color="primary" />}
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
                  <Typography variant="subtitle2" gutterBottom>Seat Covers</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.seatCovers.daily}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Daily</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.seatCovers.weekly}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Weekly</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.seatCovers.monthly}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Monthly</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Floor Mats</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.floorMats.daily}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Daily</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.floorMats.weekly}</Typography>
                      <Typography variant="body2" color="text.secondary" align="center">Weekly</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">{dashboardData.productionSummary.floorMats.monthly}</Typography>
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

export default AutomotiveDashboard;
