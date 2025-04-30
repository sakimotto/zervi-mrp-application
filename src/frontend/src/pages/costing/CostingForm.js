import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardHeader, Divider, Button, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const CostingForm = () => {
  const { id } = useParams();
  const { currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [items, setItems] = useState([]);
  const [costTypes, setCostTypes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  const [costingModel, setCostingModel] = useState({
    name: '',
    description: '',
    itemId: '',
    divisionId: currentDivision?.id || '',
    version: '1.0',
    status: 'active',
    effectiveDate: '',
    expiryDate: '',
    isDefault: false,
    directCosts: [],
    overheadCosts: [],
    pricingScenarios: []
  });

  const [newDirectCost, setNewDirectCost] = useState({
    costTypeId: '',
    amount: 0,
    unitOfMeasurement: '',
    notes: ''
  });

  const [newOverheadCost, setNewOverheadCost] = useState({
    costTypeId: '',
    amount: 0,
    allocationBase: 'direct_labor',
    percentage: 0,
    notes: ''
  });

  const [newPricingScenario, setNewPricingScenario] = useState({
    name: '',
    markupPercentage: 0,
    additionalCosts: 0,
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch items
        const itemsResponse = await api.item.getAllItems({ divisionId: currentDivision?.id });
        setItems(itemsResponse.data);
        
        // Fetch cost types
        const costTypesResponse = await api.costing.getAllCostTypes();
        setCostTypes(costTypesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCostingModel = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await api.costing.getItemCostById(id);
        setCostingModel(response.data);
      } catch (error) {
        console.error('Error fetching costing model:', error);
        setError('Failed to load costing model details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    if (id) {
      fetchCostingModel();
    }
  }, [id, currentDivision]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCostingModel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCostingModel(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Direct Cost Handlers
  const handleDirectCostChange = (e) => {
    const { name, value } = e.target;
    setNewDirectCost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDirectCost = () => {
    if (!newDirectCost.costTypeId) {
      setError('Please select a cost type');
      return;
    }
    
    const selectedCostType = costTypes.find(ct => ct.id === newDirectCost.costTypeId);
    
    setCostingModel(prev => ({
      ...prev,
      directCosts: [
        ...prev.directCosts,
        {
          ...newDirectCost,
          id: `temp-${Date.now()}`, // Temporary ID for UI purposes
          costTypeName: selectedCostType?.name || 'Unknown Cost Type'
        }
      ]
    }));
    
    // Reset form
    setNewDirectCost({
      costTypeId: '',
      amount: 0,
      unitOfMeasurement: '',
      notes: ''
    });
    
    setSuccess('Direct cost added successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeDirectCost = (index) => {
    setCostingModel(prev => ({
      ...prev,
      directCosts: prev.directCosts.filter((_, i) => i !== index)
    }));
  };

  // Overhead Cost Handlers
  const handleOverheadCostChange = (e) => {
    const { name, value } = e.target;
    setNewOverheadCost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addOverheadCost = () => {
    if (!newOverheadCost.costTypeId) {
      setError('Please select a cost type');
      return;
    }
    
    const selectedCostType = costTypes.find(ct => ct.id === newOverheadCost.costTypeId);
    
    setCostingModel(prev => ({
      ...prev,
      overheadCosts: [
        ...prev.overheadCosts,
        {
          ...newOverheadCost,
          id: `temp-${Date.now()}`, // Temporary ID for UI purposes
          costTypeName: selectedCostType?.name || 'Unknown Cost Type'
        }
      ]
    }));
    
    // Reset form
    setNewOverheadCost({
      costTypeId: '',
      amount: 0,
      allocationBase: 'direct_labor',
      percentage: 0,
      notes: ''
    });
    
    setSuccess('Overhead cost added successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeOverheadCost = (index) => {
    setCostingModel(prev => ({
      ...prev,
      overheadCosts: prev.overheadCosts.filter((_, i) => i !== index)
    }));
  };

  // Pricing Scenario Handlers
  const handlePricingScenarioChange = (e) => {
    const { name, value } = e.target;
    setNewPricingScenario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPricingScenario = () => {
    if (!newPricingScenario.name) {
      setError('Please enter a scenario name');
      return;
    }
    
    setCostingModel(prev => ({
      ...prev,
      pricingScenarios: [
        ...prev.pricingScenarios,
        {
          ...newPricingScenario,
          id: `temp-${Date.now()}` // Temporary ID for UI purposes
        }
      ]
    }));
    
    // Reset form
    setNewPricingScenario({
      name: '',
      markupPercentage: 0,
      additionalCosts: 0,
      notes: ''
    });
    
    setSuccess('Pricing scenario added successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removePricingScenario = (index) => {
    setCostingModel(prev => ({
      ...prev,
      pricingScenarios: prev.pricingScenarios.filter((_, i) => i !== index)
    }));
  };

  const calculateTotalDirectCost = () => {
    return costingModel.directCosts.reduce((total, cost) => total + parseFloat(cost.amount || 0), 0);
  };

  const calculateTotalOverheadCost = () => {
    return costingModel.overheadCosts.reduce((total, cost) => total + parseFloat(cost.amount || 0), 0);
  };

  const calculateTotalCost = () => {
    return calculateTotalDirectCost() + calculateTotalOverheadCost();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      let response;
      if (id) {
        response = await api.costing.updateItemCost(id, costingModel);
      } else {
        response = await api.costing.createItemCost(costingModel);
      }
      
      setSuccess('Costing model saved successfully');
      setTimeout(() => {
        navigate('/costing/models');
      }, 2000);
    } catch (error) {
      console.error('Error saving costing model:', error);
      setError('Failed to save costing model. Please try again.');
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
        {id ? 'Edit Costing Model' : 'Create New Costing Model'}
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
        <Tab label="Basic Information" />
        <Tab label="Direct Costs" />
        <Tab label="Overhead Costs" />
        <Tab label="Pricing Scenarios" />
      </Tabs>
      
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Costing Model Information" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Model Name"
                      name="name"
                      value={costingModel.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      multiline
                      rows={3}
                      value={costingModel.description}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Item</InputLabel>
                      <Select
                        name="itemId"
                        value={costingModel.itemId}
                        label="Item"
                        onChange={handleChange}
                      >
                        {items.map(item => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name} ({item.itemType})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Version"
                      name="version"
                      value={costingModel.version}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={costingModel.status}
                        label="Status"
                        onChange={handleChange}
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="obsolete">Obsolete</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Validity and Settings" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Effective Date"
                      name="effectiveDate"
                      value={costingModel.effectiveDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Expiry Date"
                      name="expiryDate"
                      value={costingModel.expiryDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Default Model</InputLabel>
                      <Select
                        name="isDefault"
                        value={costingModel.isDefault ? 'yes' : 'no'}
                        label="Default Model"
                        onChange={(e) => handleCheckboxChange({
                          target: {
                            name: 'isDefault',
                            checked: e.target.value === 'yes'
                          }
                        })}
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                      <Typography variant="caption" color="text.secondary">
                        Set as default costing model for this item
                      </Typography>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Cost Summary
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={8}>
                            <Typography variant="body2">Total Direct Costs:</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" align="right">
                              {calculateTotalDirectCost().toFixed(2)}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={8}>
                            <Typography variant="body2">Total Overhead Costs:</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" align="right">
                              {calculateTotalOverheadCost().toFixed(2)}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={8}>
                            <Typography variant="subtitle2">Total Cost:</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="subtitle2" align="right">
                              {calculateTotalCost().toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
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
                title="Add Direct Cost" 
                subheader="Add material, labor, and other direct costs"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth required>
                      <InputLabel>Cost Type</InputLabel>
                      <Select
            <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>