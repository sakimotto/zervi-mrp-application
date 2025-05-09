import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Typography, Card, CardContent, CardHeader, Divider, Button,
  TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress,
  Alert, Tabs, Tab, FormHelperText, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderForm = () => {
  const { id } = useParams();
  const { currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [order, setOrder] = useState({
    orderNumber: '',
    customerId: '',
    description: '',
    divisionId: currentDivision?.id || '',
    items: [],
    shippingAddress: '',
    shippingMethod: 'standard',
    paymentMethod: 'credit',
    paymentStatus: 'pending',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    status: 'draft',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch customers
        const customersResponse = await api.customer.getAllCustomers({ divisionId: currentDivision?.id });
        setCustomers(customersResponse.data);
        
        // Fetch items
        const itemsResponse = await api.item.getAllItems({ divisionId: currentDivision?.id });
        setItems(itemsResponse.data);
        
        // Generate order number if new order
        if (!id) {
          const timestamp = new Date().getTime().toString().slice(-6);
          const divisionPrefix = currentDivision?.code || 'SO';
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
        const response = await api.salesOrder.getSalesOrderById(id);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching sales order:', error);
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
    if (!order.customerId) errors.customerId = 'Customer is required';
    if (!order.items || order.items.length === 0) errors.items = 'At least one item is required';
    if (!order.expectedDeliveryDate) errors.expectedDeliveryDate = 'Delivery date is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddItem = () => {
    setOrder(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          availableStock: 0,
          allocated: false
        }
      ]
    }));
    
    if (validationErrors.items) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.items;
        return newErrors;
      });
    }
  };
  
  const handleItemChange = (index, field, value) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { 
          ...item, 
          [field]: value,
          // Check inventory when item or quantity changes
          ...((field === 'itemId' || field === 'quantity') ? { 
            availableStock: field === 'itemId' ? 
              items.find(i => i.id === value)?.quantityOnHand || 0 : 
              item.availableStock 
          } : {})
        } : item
      )
    }));
  };
  
  const handleRemoveItem = (index) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleCancel = () => {
    navigate('/sales/orders');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      setActiveTab(0);
      setError('Please fix the validation errors before submitting.');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      let response;
      if (id) {
        response = await api.salesOrder.updateSalesOrder(id, order);
      } else {
        response = await api.salesOrder.createSalesOrder(order);
      }
      
      setSuccess('Sales order saved successfully');
      setTimeout(() => {
        navigate('/sales/orders');
      }, 2000);
    } catch (error) {
      console.error('Error saving sales order:', error);
      setError('Failed to save sales order. Please try again.');
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
            {id ? 'Edit Sales Order' : 'Create New Sales Order'}
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
          <Tab label="Order Details" icon={<PersonIcon />} />
          <Tab label="Items" icon={<InventoryIcon />} />
          <Tab label="Shipping" icon={<LocalShippingIcon />} />
          <Tab label="Payment" icon={<PaymentIcon />} />
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
                      <FormControl fullWidth required error={!!validationErrors.customerId}>
                        <InputLabel>Customer</InputLabel>
                        <Select
                          name="customerId"
                          value={order.customerId}
                          onChange={handleChange}
                          label="Customer"
                        >
                          {customers.map(customer => (
                            <MenuItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {validationErrors.customerId && (
                          <FormHelperText>{validationErrors.customerId}</FormHelperText>
                        )}
                      </FormControl>
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Dates" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <DatePicker
                        label="Order Date"
                        value={order.orderDate}
                        onChange={(date) => handleDateChange('orderDate', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                        disabled
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <DatePicker
                        required
                        label="Expected Delivery Date"
                        value={order.expectedDeliveryDate}
                        onChange={(date) => handleDateChange('expectedDeliveryDate', date)}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            error: !!validationErrors.expectedDeliveryDate,
                            helperText: validationErrors.expectedDeliveryDate
                          } 
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {activeTab === 1 && (
          <Card>
            <CardHeader 
              title="Order Items" 
              action={
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {order.items.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No items added to this order
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Available</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Discount</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell width={50}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl fullWidth>
                              <Select
                                value={item.itemId}
                                onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                              >
                                {items.map(i => (
                                  <MenuItem key={i.id} value={i.id}>
                                    {i.name} ({i.sku})
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              inputProps={{ min: 1 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {item.availableStock}
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.discount}
                              onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                              inputProps={{ min: 0, max: 100, step: 1 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {((item.unitPrice * item.quantity) * (1 - (item.discount / 100))).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleRemoveItem(index)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}
        
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Shipping Information" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Shipping Address"
                        name="shippingAddress"
                        multiline
                        rows={4}
                        value={order.shippingAddress}
                        onChange={handleChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Shipping Method</InputLabel>
                        <Select
                          name="shippingMethod"
                          value={order.shippingMethod}
                          onChange={handleChange}
                          label="Shipping Method"
                        >
                          <MenuItem value="standard">Standard Shipping</MenuItem>
                          <MenuItem value="express">Express Shipping</MenuItem>
                          <MenuItem value="pickup">Customer Pickup</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Payment Information" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                          name="paymentMethod"
                          value={order.paymentMethod}
                          onChange={handleChange}
                          label="Payment Method"
                        >
                          <MenuItem value="credit">Credit Card</MenuItem>
                          <MenuItem value="bank">Bank Transfer</MenuItem>
                          <MenuItem value="cash">Cash</MenuItem>
                          <MenuItem value="check">Check</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Payment Status</InputLabel>
                        <Select
                          name="paymentStatus"
                          value={order.paymentStatus}
                          onChange={handleChange}
                          label="Payment Status"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="partial">Partial</MenuItem>
                          <MenuItem value="paid">Paid</MenuItem>
                          <MenuItem value="refunded">Refunded</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default OrderForm;