import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardHeader, Divider, Button, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress, Alert, Tabs, Tab, FormHelperText, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

// Icons
import ContentCutIcon from '@mui/icons-material/ContentCut';
import LayersIcon from '@mui/icons-material/Layers';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import BrushIcon from '@mui/icons-material/Brush';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

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
  const [specializedOperations, setSpecializedOperations] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
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

        // Fetch specialized operations
        // This is a mock for now - in a real implementation, this would be fetched from the API
        setSpecializedOperations([
          { id: 1, type: 'cutting', name: 'Standard Cutting' },
          { id: 2, type: 'cutting', name: 'Precision Cutting' },
          { id: 3, type: 'sewing', name: 'Basic Seam' },
          { id: 4, type: 'sewing', name: 'Reinforced Stitch' },
          { id: 5, type: 'laminating', name: 'Heat Bonding' },
          { id: 6, type: 'laminating', name: 'Adhesive Bonding' },
          { id: 7, type: 'embroidery', name: 'Standard Logo' },
          { id: 8, type: 'embroidery', name: 'Custom Pattern' },
        ]);
        
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

  const validate = () => {
    const errors = {};
    
    if (!order.orderNumber) errors.orderNumber = 'Order number is required';
    if (!order.itemId) errors.itemId = 'Product is required';
    if (!order.bomId) errors.bomId = 'BOM is required';
    if (!order.quantity || order.quantity <= 0) errors.quantity = 'Quantity must be greater than 0';
    
    if (!order.plannedStartDate) {
      errors.plannedStartDate = 'Start date is required';
    }
    
    if (!order.plannedEndDate) {
      errors.plannedEndDate = 'End date is required';
    } else if (order.plannedStartDate && order.plannedEndDate && new Date(order.plannedEndDate) <= new Date(order.plannedStartDate)) {
      errors.plannedEndDate = 'End date must be after start date';
    }
    
    if (order.operations.length === 0) {
      errors.operations = 'At least one operation is required';
    } else {
      // Validate each operation
      const operationErrors = order.operations.map(op => {
        const opErrors = {};
        if (!op.operationType) opErrors.operationType = 'Operation type is required';
        if (!op.workstationId) opErrors.workstationId = 'Workstation is required';
        
        // Only add to errors if there are any
        return Object.keys(opErrors).length > 0 ? opErrors : null;
      });
      
      if (operationErrors.some(err => err !== null)) {
        errors.operations = operationErrors;
      }
    }
    
    if (order.materials.length === 0) {
      errors.materials = 'At least one material is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (name, date) => {
    setOrder(prev => ({
      ...prev,
      [name]: date ? new Date(date).toISOString().split('T')[0] : ''
    }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
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
        unitOfMeasurement: bom.unitOfMeasurement || prev.unitOfMeasurement,
        materials: bom.components.map(component => ({
          itemId: component.childItemId,
          quantity: component.quantity,
          unitOfMeasurement: component.unitOfMeasurement,
          name: component.name || items.find(item => item.id === component.childItemId)?.name || '',
          allocated: false,
          consumed: false
        })),
        operations: bom.operations ? bom.operations.map((operation, index) => ({
          operationType: operation.operationType,
          workstationId: '',
          sequence: index + 1,
          setupTime: operation.setupTime || 0,
          runTime: operation.runTime || 0,
          specialOperationId: '',
          resourceRequirements: [],
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
          specialOperationId: '',
          resourceRequirements: [],
          status: 'pending'
        }
      ]
    }));
    
    // Clear operations validation error if it exists
    if (validationErrors.operations) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.operations;
        return newErrors;
      });
    }
  };

  const handleOperationChange = (index, field, value) => {
    setOrder(prev => ({
      ...prev,
      operations: prev.operations.map((op, i) => 
        i === index ? { ...op, [field]: value } : op
      )
    }));
    
    // Clear validation error for this operation if it exists
    if (validationErrors.operations && Array.isArray(validationErrors.operations) && validationErrors.operations[index]) {
      const newOperationErrors = [...validationErrors.operations];
      newOperationErrors[index] = null;
      
      setValidationErrors(prev => ({
        ...prev,
        operations: newOperationErrors.some(err => err !== null) ? newOperationErrors : undefined
      }));
    }
  };

  const handleRemoveOperation = (index) => {
    setOrder(prev => {
      const updatedOperations = prev.operations.filter((_, i) => i !== index);
      
      // Update sequences for remaining operations
      return {
        ...prev,
        operations: updatedOperations.map((op, i) => ({
          ...op,
          sequence: i + 1
        }))
      };
    });
  };
  
  const handleAddMaterial = () => {
    setOrder(prev => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          itemId: '',
          quantity: 1,
          unitOfMeasurement: '',
          allocated: false,
          consumed: false
        }
      ]
    }));
    
    // Clear materials validation error if it exists
    if (validationErrors.materials) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.materials;
        return newErrors;
      });
    }
  };
  
  const handleMaterialChange = (index, field, value) => {
    setOrder(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index ? { 
          ...material, 
          [field]: value,
          // Update name if itemId changed
          ...(field === 'itemId' ? { name: items.find(item => item.id === value)?.name || '' } : {})
        } : material
      )
    }));
  };
  
  const handleRemoveMaterial = (index) => {
    setOrder(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const reorderedOperations = Array.from(order.operations);
    const [removed] = reorderedOperations.splice(result.source.index, 1);
    reorderedOperations.splice(result.destination.index, 0, removed);
    
    // Update sequences
    const updatedOperations = reorderedOperations.map((op, index) => ({
      ...op,
      sequence: index + 1
    }));
    
    setOrder(prev => ({
      ...prev,
      operations: updatedOperations
    }));
  };

  const handleCancel = () => {
    navigate('/manufacturing/orders');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validate()) {
      setActiveTab(0); // Show first tab where most validation errors might be
      setError('Please fix the validation errors before submitting.');
      return;
    }
    
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {id ? 'Edit Manufacturing Order' : 'Create New Manufacturing Order'}
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<CancelIcon />} 
              onClick={handleCancel}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Order'}
            </Button>
          </Box>
        </Box>
        
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
                        error={!!validationErrors.orderNumber}
                        helperText={validationErrors.orderNumber}
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
                      <FormControl fullWidth required error={!!validationErrors.bomId}>
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
                        {validationErrors.bomId && (
                          <FormHelperText>{validationErrors.bomId}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth required disabled error={!!validationErrors.itemId}>
                        <InputLabel>Product</InputLabel>
                        <Select
                          name="itemId"
                          value={order.itemId}
                          label="Product"
                        >
                          {items.map(item => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {validationErrors.itemId && (
                          <FormHelperText>{validationErrors.itemId}</FormHelperText>
                        )}
                        <FormHelperText>
                          Product is automatically selected based on BOM
                        </FormHelperText>
                      </FormControl>
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
                        error={!!validationErrors.quantity}
                        helperText={validationErrors.quantity}
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
                      <DatePicker
                        label="Planned Start Date"
                        value={order.plannedStartDate ? new Date(order.plannedStartDate) : null}
                        onChange={(date) => handleDateChange('plannedStartDate', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            fullWidth
                            error={!!validationErrors.plannedStartDate}
                            helperText={validationErrors.plannedStartDate}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <DatePicker
                        label="Planned End Date"
                        value={order.plannedEndDate ? new Date(order.plannedEndDate) : null}
                        onChange={(date) => handleDateChange('plannedEndDate', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            fullWidth
                            error={!!validationErrors.plannedEndDate}
                            helperText={validationErrors.plannedEndDate}
                          />
                        )}
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
                  subheader="Define the sequence of operations required to produce the item. Drag to reorder."
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
                  {validationErrors.operations && typeof validationErrors.operations === 'string' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {validationErrors.operations}
                    </Alert>
                  )}
                  
                  {order.operations.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No operations added yet. Add operations using the buttons above or select a BOM with predefined operations.
                    </Typography>
                  ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="operations">
                        {(provided) => (
                          <TableContainer component={Paper} ref={provided.innerRef} {...provided.droppableProps}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell width="50px"></TableCell>
                                  <TableCell width="80px" align="center">Sequence</TableCell>
                                  <TableCell>Operation Type</TableCell>
                                  <TableCell>Specialized Operation</TableCell>
                                  <TableCell>Workstation</TableCell>
                                  <TableCell align="right">Setup Time (min)</TableCell>
                                  <TableCell align="right">Run Time (min)</TableCell>
                                  <TableCell align="center">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.operations.map((operation, index) => (
                                  <Draggable key={index} draggableId={`operation-${index}`} index={index}>
                                    {(provided) => (
                                      <TableRow
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                      >
                                        <TableCell {...provided.dragHandleProps}>
                                          <DragIndicatorIcon color="action" />
                                        </TableCell>
                                        <TableCell align="center">{operation.sequence}</TableCell>
                                        <TableCell>
                                          <FormControl 
                                            fullWidth 
                                            required 
                                            error={validationErrors.operations && 
                                              Array.isArray(validationErrors.operations) && 
                                              validationErrors.operations[index] && 
                                              validationErrors.operations[index].operationType}
                                          >
                                            <InputLabel>Type</InputLabel>
                                            <Select
                                              value={operation.operationType}
                                              label="Type"
                                              onChange={(e) => handleOperationChange(index, 'operationType', e.target.value)}
                                            >
                                              <MenuItem value="cutting">Cutting</MenuItem>
                                              <MenuItem value="sewing">Sewing</MenuItem>
                                              <MenuItem value="laminating">Laminating</MenuItem>
                                              <MenuItem value="embroidery">Embroidery</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </TableCell>
                                        <TableCell>
                                          <FormControl fullWidth>
                                            <InputLabel>Specialized Operation</InputLabel>
                                            <Select
                                              value={operation.specialOperationId}
                                              label="Specialized Operation"
                                              onChange={(e) => handleOperationChange(index, 'specialOperationId', e.target.value)}
                                            >
                                              <MenuItem value="">Standard</MenuItem>
                                              {specializedOperations
                                                .filter(op => op.type === operation.operationType)
                                                .map(op => (
                                                  <MenuItem key={op.id} value={op.id}>
                                                    {op.name}
                                                  </MenuItem>
                                                ))
                                              }
                                            </Select>
                                          </FormControl>
                                        </TableCell>
                                        <TableCell>
                                          <FormControl 
                                            fullWidth 
                                            required 
                                            error={validationErrors.operations && 
                                              Array.isArray(validationErrors.operations) && 
                                              validationErrors.operations[index] && 
                                              validationErrors.operations[index].workstationId}
                                          >
                                            <InputLabel>Workstation</InputLabel>
                                            <Select
                                              value={operation.workstationId}
                                              label="Workstation"
                                              onChange={(e) => handleOperationChange(index, 'workstationId', e.target.value)}
                                            >
                                              {workstations
                                                .filter(ws => !ws.type || ws.type === operation.operationType)
                                                .map(workstation => (
                                                  <MenuItem key={workstation.id} value={workstation.id}>
                                                    {workstation.name}
                                                  </MenuItem>
                                                ))
                                              }
                                            </Select>
                                          </FormControl>
                                        </TableCell>
                                        <TableCell align="right">
                                          <TextField
                                            type="number"
                                            value={operation.setupTime}
                                            onChange={(e) => handleOperationChange(index, 'setupTime', parseInt(e.target.value) || 0)}
                                            inputProps={{ min: 0, step: 1 }}
                                          />
                                        </TableCell>
                                        <TableCell align="right">
                                          <TextField
                                            type="number"
                                            value={operation.runTime}
                                            onChange={(e) => handleOperationChange(index, 'runTime', parseInt(e.target.value) || 0)}
                                            inputProps={{ min: 0, step: 1 }}
                                          />
                                        </TableCell>
                                        <TableCell align="center">
                                          <Tooltip title="Remove Operation">
                                            <IconButton 
                                              color="error" 
                                              onClick={() => handleRemoveOperation(index)}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Tooltip>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Material Requirements" 
                  subheader="Define the materials required for this manufacturing order"
                  action={
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddMaterial}
                    >
                      Add Material
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  {validationErrors.materials && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {validationErrors.materials}
                    </Alert>
                  )}
                  
                  {order.materials.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No materials added yet. Select a BOM to automatically load materials or add them manually.
                    </Typography>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Material</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.materials.map((material, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <FormControl fullWidth required>
                                  <InputLabel>Material</InputLabel>
                                  <Select
                                    value={material.itemId}
                                    label="Material"
                                    onChange={(e) => handleMaterialChange(index, 'itemId', e.target.value)}
                                  >
                                    {items.map(item => (
                                      <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  type="number"
                                  value={material.quantity}
                                  onChange={(e) => handleMaterialChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                  inputProps={{ min: 0.01, step: 0.01 }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={material.unitOfMeasurement}
                                  onChange={(e) => handleMaterialChange(index, 'unitOfMeasurement', e.target.value)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Remove Material">
                                  <IconButton 
                                    color="error" 
                                    onClick={() => handleRemoveMaterial(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            startIcon={<CancelIcon />} 
            onClick={handleCancel}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Order'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ManufacturingOrderForm;