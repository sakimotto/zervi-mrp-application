import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardHeader, Divider, Button, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Icons
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const InterDivisionTransferForm = () => {
  const { id } = useParams();
  const { currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [items, setItems] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  const [transfer, setTransfer] = useState({
    transferNumber: '',
    description: '',
    sourceDivisionId: currentDivision?.id || '',
    destinationDivisionId: '',
    sourceWarehouseId: '',
    destinationWarehouseId: '',
    plannedDate: '',
    status: 'planned',
    items: []
  });

  const [newItem, setNewItem] = useState({
    itemId: '',
    quantity: 1,
    unitOfMeasurement: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch divisions
        const divisionsResponse = await api.division.getAllDivisions();
        setDivisions(divisionsResponse.data);
        
        // Fetch items for current division
        const itemsResponse = await api.item.getAllItems({ divisionId: currentDivision?.id });
        setItems(itemsResponse.data);
        
        // Fetch warehouses for current division
        const warehousesResponse = await api.item.getAllWarehouses({ divisionId: currentDivision?.id });
        setWarehouses(warehousesResponse.data);
        
        // Generate transfer number if new transfer
        if (!id) {
          const timestamp = new Date().getTime().toString().slice(-6);
          const divisionPrefix = currentDivision?.code || 'TR';
          setTransfer(prev => ({
            ...prev,
            transferNumber: `${divisionPrefix}-${timestamp}`,
            sourceDivisionId: currentDivision?.id || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTransfer = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await api.transfer.getTransferById(id);
        setTransfer(response.data);
      } catch (error) {
        console.error('Error fetching transfer:', error);
        setError('Failed to load transfer details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    if (id) {
      fetchTransfer();
    }
  }, [id, currentDivision]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransfer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDestinationDivisionChange = async (e) => {
    const destinationDivisionId = e.target.value;
    setTransfer(prev => ({
      ...prev,
      destinationDivisionId,
      destinationWarehouseId: '' // Reset warehouse when division changes
    }));
    
    if (!destinationDivisionId) return;
    
    try {
      // Fetch warehouses for destination division
      const warehousesResponse = await api.item.getAllWarehouses({ divisionId: destinationDivisionId });
      setWarehouses(prev => {
        // Keep source warehouses and add destination warehouses
        const sourceWarehouses = prev.filter(w => w.divisionId === transfer.sourceDivisionId);
        return [...sourceWarehouses, ...warehousesResponse.data];
      });
    } catch (error) {
      console.error('Error fetching destination warehouses:', error);
      setError('Failed to load destination warehouses. Please try again.');
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    const selectedItem = items.find(item => item.id === itemId);
    
    setNewItem(prev => ({
      ...prev,
      itemId,
      unitOfMeasurement: selectedItem?.unitOfMeasurement || ''
    }));
  };

  const addItem = () => {
    if (!newItem.itemId) {
      setError('Please select an item');
      return;
    }
    
    const selectedItem = items.find(item => item.id === newItem.itemId);
    
    setTransfer(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...newItem,
          id: `temp-${Date.now()}`, // Temporary ID for UI purposes
          itemName: selectedItem?.name || 'Unknown Item',
          received: false,
          receivedQuantity: 0
        }
      ]
    }));
    
    // Reset new item form
    setNewItem({
      itemId: '',
      quantity: 1,
      unitOfMeasurement: '',
      notes: ''
    });
    
    setSuccess('Item added successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeItem = (index) => {
    setTransfer(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      let response;
      if (id) {
        response = await api.transfer.updateTransfer(id, transfer);
      } else {
        response = await api.transfer.createTransfer(transfer);
      }
      
      setSuccess('Inter-division transfer saved successfully');
      setTimeout(() => {
        navigate('/transfers');
      }, 2000);
    } catch (error) {
      console.error('Error saving transfer:', error);
      setError('Failed to save transfer. Please try again.');
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
        {id ? 'Edit Inter-Division Transfer' : 'Create New Inter-Division Transfer'}
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
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Transfer Information" 
              avatar={<SwapHorizIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Transfer Number"
                    name="transferNumber"
                    value={transfer.transferNumber}
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
                    value={transfer.description}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Source Division</InputLabel>
                    <Select
                      name="sourceDivisionId"
                      value={transfer.sourceDivisionId}
                      label="Source Division"
                      onChange={handleChange}
                      disabled={!!id} // Can't change source division after creation
                    >
                      {divisions.map(division => (
                        <MenuItem key={division.id} value={division.id}>
                          {division.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Source Warehouse</InputLabel>
                    <Select
                      name="sourceWarehouseId"
                      value={transfer.sourceWarehouseId}
                      label="Source Warehouse"
                      onChange={handleChange}
                    >
                      {warehouses
                        .filter(warehouse => warehouse.divisionId === transfer.sourceDivisionId)
                        .map(warehouse => (
                          <MenuItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Destination Information" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Destination Division</InputLabel>
                    <Select
                      name="destinationDivisionId"
                      value={transfer.destinationDivisionId}
                      label="Destination Division"
                      onChange={handleDestinationDivisionChange}
                      disabled={!!id} // Can't change destination division after creation
                    >
                      {divisions
                        .filter(division => division.id !== transfer.sourceDivisionId)
                        .map(division => (
                          <MenuItem key={division.id} value={division.id}>
                            {division.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Destination Warehouse</InputLabel>
                    <Select
                      name="destinationWarehouseId"
                      value={transfer.destinationWarehouseId}
                      label="Destination Warehouse"
                      onChange={handleChange}
                    >
                      {warehouses
                        .filter(warehouse => warehouse.divisionId === transfer.destinationDivisionId)
                        .map(warehouse => (
                          <MenuItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="date"
                    label="Planned Transfer Date"
                    name="plannedDate"
                    value={transfer.plannedDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={transfer.status}
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
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Add Items to Transfer" 
              subheader="Select items to transfer from source to destination division"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Item</InputLabel>
                    <Select
                      name="itemId"
                      value={newItem.itemId}
                      label="Item"
                      onChange={handleItemSelect}
                    >
                      {items.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name} ({item.itemType})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleNewItemChange}
                    inputProps={{ min: 0.01, step: 0.01 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Unit of Measurement"
                    name="unitOfMeasurement"
                    value={newItem.unitOfMeasurement}
                    onChange={handleNewItemChange}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={newItem.notes}
                    onChange={handleNewItemChange}
                  />
                </Grid>
                
                <Grid item xs={12} md={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={addItem}
                    sx={{ height: '100%' }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Transfer Items" 
              subheader={`${transfer.items.length} items added to transfer`}
            />
            <Divider />
            <CardContent>
              {transfer.items.length === 0 ? (
                <Typograp<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>