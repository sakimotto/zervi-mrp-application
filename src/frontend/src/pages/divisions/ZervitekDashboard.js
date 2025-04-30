import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CardHeader, Divider, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';
import LayersIcon from '@mui/icons-material/Layers';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import BrushIcon from '@mui/icons-material/Brush';

const ZervitekDashboard = () => {
  const { currentUser, currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    inventorySummary: { totalItems: 0, lowStock: 0, outOfStock: 0 },
    manufacturingOrders: { total: 0, inProgress: 0, completed: 0, delayed: 0 },
    outgoingTransfers: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    specializedOperations: {
      laminating: { total: 0, pending: 0, inProgress: 0, completed: 0 },
      cutting: { total: 0, pending: 0, inProgress: 0, completed: 0 },
      sewing: { total: 0, pending: 0, inProgress: 0, completed: 0 },
      embroidery: { total: 0, pending: 0, inProgress: 0, completed: 0 }
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
          inventorySummary: { totalItems: 856, lowStock: 24, outOfStock: 6 },
          manufacturingOrders: { total: 42, inProgress: 18, completed: 21, delayed: 3 },
          outgoingTransfers: { total: 28, pending: 8, inProgress: 12, completed: 8 },
          specializedOperations: {
            laminating: { total: 35, pending: 12, inProgress: 15, completed: 8 },
            cutting: { total: 42, pending: 14, inProgress: 18, completed: 10 },
            sewing: { total: 28, pending: 8, inProgress: 12, completed: 8 },
            embroidery: { total: 15, pending: 5, inProgress: 6, completed: 4 }
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
        Zervitek Division Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Technical Textile Division - Semi-finished Goods Production
      </Typography>

      <Grid container spacing={3}>
        {/* Inventory Summary */}
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
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

        {/* Outgoing Transfers */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Outgoing Transfers to Other Divisions" 
              subheader="Semi-finished goods supplied to other divisions"
              action={
                <Button size="small" onClick={() => navigateTo('/transfers')}>
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center">{dashboardData.outgoingTransfers.total}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Total</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="warning.main">{dashboardData.outgoingTransfers.pending}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Pending</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="info.main">{dashboardData.outgoingTransfers.inProgress}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">In Progress</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" align="center" color="success.main">{dashboardData.outgoingTransfers.completed}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Completed</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Specialized Operations */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Specialized Operations
          </Typography>
        </Grid>

        {/* Laminating Operations */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader 
              title="Laminating" 
              avatar={<LayersIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/operations/laminating')}>
                  View
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center" color="info.main">{dashboardData.specializedOperations.laminating.inProgress}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">In Progress</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center" color="success.main">{dashboardData.specializedOperations.laminating.completed}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Completed</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Cutting Operations */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader 
              title="Cutting" 
              avatar={<ContentCutIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/operations/cutting')}>
                  View
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center" color="info.main">{dashboardData.specializedOperations.cutting.inProgress}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">In Progress</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center" color="success.main">{dashboardData.specializedOperations.cutting.completed}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Completed</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sewing Operations */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader 
              title="Sewing" 
              avatar={<LinearScaleIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/operations/sewing')}>
                  View
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center" color="info.main">{dashboardData.specializedOperations.sewing.inProgress}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">In Progress</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center" color="success.main">{dashboardData.specializedOperations.sewing.completed}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Completed</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Embroidery Operations */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader 
              title="Embroidery" 
              avatar={<BrushIcon color="primary" />}
              action={
                <Button size="small" onClick={() => navigateTo('/operations/embroidery')}>
                  View
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center" color="info.main">{dashboardData.specializedOperations.embroidery.inProgress}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">In Progress</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center" color="success.main">{dashboardData.specializedOperations.embroidery.completed}</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">Completed</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ZervitekDashboard;
