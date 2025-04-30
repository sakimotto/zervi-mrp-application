import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardHeader, Divider, Button, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Icons
import ContentCutIcon from '@mui/icons-material/ContentCut';
import LayersIcon from '@mui/icons-material/Layers';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import BrushIcon from '@mui/icons-material/Brush';

const ManufacturingOrderForm = () => {
  const { id } = useParams();
  const { currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [items, setItems] = useState([]);
  const [boms, setBoms] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  const [order, setOrder] = useState({
    orderNumber: '',
    description: '',
    itemId: '',
    bomId: '',
    divisionId: currentDivision?.id || '',
    quantity: 1,
    unitOfMeasurement: '',
    plannedStartDate: '',
    plannedEndDate: '',
    priority: 'medium',
    status: 'planned',
    materials: [],
    operations: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch items
        const itemsResponse = await api.item.getAllItems({ divisionId: currentDivision?.id });
        setItems(itemsResponse.data);
        
        // Fetch BOMs
        const bomsResponse = await api.bom.getAllBoms({ divisionId: currentDivision?.id });
        setBoms(bomsResponse.data);
        
        // Fetch workstations
        const workstationsResponse = await api.manufacturingOrder.getAllWorkstations({ divisionId: currentDivision?.id });
        setWorkstations(workstationsResponse.data);
        
        // Generate order number if new order
        if (!id) {
          const timestamp = new Date().getTime().toString().slice(-6);
          const divisionPrefix = currentDivision?.code || 'MO';
          setOrder(prev => ({
            ...prev,
            orderNumber: `${divisionPrefix}-${timestamp}`
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrder = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await api.manufacturingOrder.getManufacturingOrderById(id);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching manufacturing order:', error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    if (id) {
      fetchOrder();
    }
  }, [id, currentDivision]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBomChange = async (e) => {
    const bomId = e.target.value;
    setOrder(prev => ({
      ...prev,
      bomId
    }));
    
    if (!bomId) return;
    
    try {
      // Fetch BOM details to get materials and operations
      const bomResponse = await api.bom.getBomById(bomId);
      const bom = bomResponse.data;
      
      // Set the item ID from the BOM
      setOrder(prev => ({
        ...prev,
        itemId: bom.itemId,
        materials: bom.components.map(component => ({
          itemId: component.childItemId,
          quantity: component.quantity,
          unitOfMeasurement: component.unitOfMeasurement,
          allocated: false,
          consumed: false
        })),
        operations: bom.operations ? bom.operations.map(operation => ({
          operationType: operation.operationType,
          workstationId: '',
          sequence: operation.sequence,
          setupTime: operation.setupTime || 0,
          runTime: operation.runTime || 0,
          status: 'pending'
        })) : []
      }));
    } catch (error) {
      console.error('Error fetching BOM details:', error);
      setError('Failed to load BOM details. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddOperation = (operationType) => {
    setOrder(prev => ({
      ...prev,
      operations: [
        ...prev.operations,
        {
          operationType,
          workstationId: '',
          sequence: prev.operations.length + 1,
          setupTime: 0,
          runTime: 0,
          status: 'pending'
        }
      ]
    }));
  };

  const handleOperationChange = (index, field, value) => {
    setOrder(prev => ({
      ...prev,
      operations: prev.operations.map((op, i) => 
        i === index ? { ...op, [field]: value } : op
      )
    }));
  };

  const handleRemoveOperation = (index) => {
    setOrder(prev => ({
      ...prev,
      operations: prev.operations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      let response;
      if (id) {
        response = await api.manufacturingOrder.updateManufacturingOrder(id, order);
      } else {
        response = await api.manufacturingOrder.createManufacturingOrder(order);
      }
      
      setSuccess('Manufacturing order saved successfully');
      setTimeout(() => {
        navigate('/manufacturing/orders');
      }, 2000);
    } catch (error) {
      console.error('Error saving manufacturing order:', error);
      setError('Failed to save manufacturing order. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Manufacturing Order' : 'Create New Manufacturing Order'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Order Details" />
        <Tab label="Operations" />
        <Tab label="Materials" />
      </Tabs>
      
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Order Information" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Order Number"
                      name="orderNumber"
                      value={order.orderNumber}
                      onChange={handleChange}
                      disabled={!!id}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      multiline
                      rows={3}
                      value={order.description}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>BOM</InputLabel>
                      <Select
                        name="bomId"
                        value={order.bomId}
                        label="BOM"
                        onChange={handleBomChange}
                      >
                        {boms.map(bom => (
                          <MenuItem key={bom.id} value={bom.id}>
                            {bom.name} (v{bom.version})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth required disabled>
                      <InputLabel>Item</InputLabel>
                      <Select
                        name="itemId"
                        value={order.itemId}
                        label="Item"
                      >
                        {items.map(item => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography variant="caption" color="text.secondary">
                      Item is automatically selected based on BOM
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Production Details" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      label="Quantity"
                      name="quantity"
                      value={order.quantity}
                      onChange={handleChange}
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Unit of Measurement"
                      name="unitOfMeasurement"
                      value={order.unitOfMeasurement}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      label="Planned Start Date"
                      name="plannedStartDate"
                      value={order.plannedStartDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      label="Planned End Date"
                      name="plannedEndDate"
                      value={order.plannedEndDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        name="priority"
                        value={order.priority}
                        label="Priority"
                        onChange={handleChange}
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="urgent">Urgent</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={order.status}
                        label="Status"
                        onChange={handleChange}
                      >
                        <MenuItem value="planned">Planned</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title="Manufacturing Operations" 
                subheader="Define the sequence of operations required to produce the item"
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LayersIcon />}
                      onClick={() => handleAddOperation('laminating')}
                    >
                      Add Laminating
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ContentCutIcon />}
                      onClick={() => handleAddOperation('cutting')}
                    >
                      Add Cutting
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LinearScaleIcon />}
                      onClick={() => handleAddOperation('sewing')}
                    >
                      Add Sewing
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<BrushIcon />}
                      onClick={() => handleAddOperation('embroidery')}
                    >
                      Add Embroidery
                    </Button>
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                {order.operations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No operations added yet. Add operations using the buttons above or select a BOM with predefined operations.
                  </Typography>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Sequence</th>
                          <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Operation Type</th>
                          <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Workstation</th>
                          <th style={{ textAlign: 'center', padding: '8px', border<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>