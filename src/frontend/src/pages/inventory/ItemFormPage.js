import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

// Mock warehouse data
const getMockWarehouses = () => {
  return [
    { id: 'A', name: 'Warehouse A' },
    { id: 'B', name: 'Warehouse B' },
    { id: 'C', name: 'Warehouse C' },
    { id: 'D', name: 'Warehouse D' },
    { id: 'E', name: 'Warehouse E' }
  ];
};

// Mock suppliers data
const getMockSuppliers = () => {
  return [
    { id: 1, name: 'Textile Industries Ltd.' },
    { id: 2, name: 'Synthetic Materials Co.' },
    { id: 3, name: 'Hardware Supply Inc.' },
    { id: 4, name: 'Global Components Ltd.' },
    { id: 5, name: 'Packaging Solutions' }
  ];
};

// Mock item categories
const itemCategories = [
  'Raw Material',
  'Component',
  'Finished Good',
  'Packaging',
  'Consumable'
];

// Mock units
const itemUnits = [
  'pcs',
  'meters',
  'sq.m',
  'kg',
  'liters',
  'boxes',
  'rolls',
  'spools',
  'sheets',
  'pairs'
];

// Get a specific item by ID for editing
const getMockItemById = (id) => {
  const mockItems = [
    {
      id: 1,
      sku: 'FAB-001',
      name: 'Cotton Fabric - Blue',
      category: 'Raw Material',
      quantity: 250,
      unit: 'meters',
      location: 'Warehouse A',
      minimumStock: 50,
      reorderPoint: 75,
      costPerUnit: 5.75,
      description: 'High-quality cotton fabric in blue color. Used for manufacturing bags and clothing items.',
      supplier: 1,
      tags: ['fabric', 'cotton', 'blue'],
      isActive: true
    },
    {
      id: 2,
      sku: 'FAB-002',
      name: 'Cotton Fabric - Red',
      category: 'Raw Material',
      quantity: 180,
      unit: 'meters',
      location: 'Warehouse A',
      minimumStock: 50,
      reorderPoint: 75,
      costPerUnit: 5.75,
      description: 'High-quality cotton fabric in red color. Used for manufacturing bags and clothing items.',
      supplier: 1,
      tags: ['fabric', 'cotton', 'red'],
      isActive: true
    }
  ];
  
  return mockItems.find(item => item.id === parseInt(id)) || null;
};

// Validation schema
const validationSchema = Yup.object({
  sku: Yup.string()
    .required('SKU is required')
    .max(20, 'SKU must be 20 characters or less'),
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be 100 characters or less'),
  category: Yup.string()
    .required('Category is required'),
  quantity: Yup.number()
    .min(0, 'Quantity must be a positive number')
    .required('Quantity is required'),
  unit: Yup.string()
    .required('Unit is required'),
  location: Yup.string()
    .required('Location is required'),
  minimumStock: Yup.number()
    .min(0, 'Minimum stock must be a positive number')
    .required('Minimum stock is required'),
  reorderPoint: Yup.number()
    .min(0, 'Reorder point must be a positive number')
    .required('Reorder point is required'),
  costPerUnit: Yup.number()
    .min(0, 'Cost per unit must be a positive number')
    .required('Cost per unit is required'),
  supplier: Yup.number()
    .required('Supplier is required'),
  description: Yup.string()
    .max(500, 'Description must be 500 characters or less'),
  isActive: Yup.boolean(),
  trackBatches: Yup.boolean(),
  trackSerials: Yup.boolean(),
  barcodeFormat: Yup.string()
    .when('useBarcode', {
      is: true,
      then: Yup.string().required('Barcode format is required'),
    }),
  allowSplit: Yup.boolean()
});

export default function ItemFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewItem = !id;
  const [loading, setLoading] = useState(!isNewItem);
  const [item, setItem] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Fetch warehouses and suppliers data
    setWarehouses(getMockWarehouses());
    setSuppliers(getMockSuppliers());

    // If editing an existing item, fetch its data
    if (!isNewItem) {
      const timer = setTimeout(() => {
        try {
          const fetchedItem = getMockItemById(id);
          if (fetchedItem) {
            setItem(fetchedItem);
          } else {
            setError("Item not found");
          }
          setLoading(false);
        } catch (err) {
          setError("Error loading item details");
          setLoading(false);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [id, isNewItem]);

  const initialValues = isNewItem
    ? {
        sku: '',
        name: '',
        category: '',
        quantity: 0,
        unit: '',
        location: '',
        minimumStock: 0,
        reorderPoint: 0,
        costPerUnit: 0,
        supplier: '',
        description: '',
        isActive: true,
        trackBatches: false,
        trackSerials: false,
        useBarcode: false,
        barcodeFormat: '',
        allowSplit: false
      }
    : item;

  const handleSubmit = (values, { setSubmitting }) => {
    // Simulate API call
    setTimeout(() => {
      console.log('Submitting form:', values);
      setSuccessMessage(isNewItem ? 'Item created successfully!' : 'Item updated successfully!');
      setOpenSnackbar(true);
      setSubmitting(false);
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/inventory/items');
      }, 1500);
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/inventory/items');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isNewItem ? 'Add New Item' : 'Edit Item'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/inventory/items')}
          sx={{ mb: 2 }}
        >
          Back to Inventory
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!isNewItem && !item) {
    return null; // Wait for item to load
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </Link>
        <Link 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/inventory')}
        >
          Inventory
        </Link>
        <Link 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/inventory/items')}
        >
          Items
        </Link>
        <Typography color="text.primary">
          {isNewItem ? 'Add New Item' : `Edit ${item.name}`}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/inventory/items')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          {isNewItem ? 'Add New Inventory Item' : `Edit Item: ${item.name}`}
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, isSubmitting, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6">Basic Information</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="sku"
                    name="sku"
                    label="SKU *"
                    value={values.sku}
                    onChange={handleChange}
                    error={touched.sku && Boolean(errors.sku)}
                    helperText={touched.sku && errors.sku}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Item Name *"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
                    <InputLabel id="category-label">Category *</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={values.category}
                      label="Category *"
                      onChange={handleChange}
                    >
                      {itemCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.category && errors.category && (
                      <FormHelperText>{errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={touched.supplier && Boolean(errors.supplier)}>
                    <InputLabel id="supplier-label">Supplier *</InputLabel>
                    <Select
                      labelId="supplier-label"
                      id="supplier"
                      name="supplier"
                      value={values.supplier}
                      label="Supplier *"
                      onChange={handleChange}
                    >
                      {suppliers.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.supplier && errors.supplier && (
                      <FormHelperText>{errors.supplier}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                {/* Inventory Details */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6">Inventory Details</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="quantity"
                    name="quantity"
                    label="Current Quantity *"
                    type="number"
                    value={values.quantity}
                    onChange={handleChange}
                    error={touched.quantity && Boolean(errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={touched.unit && Boolean(errors.unit)}>
                    <InputLabel id="unit-label">Unit *</InputLabel>
                    <Select
                      labelId="unit-label"
                      id="unit"
                      name="unit"
                      value={values.unit}
                      label="Unit *"
                      onChange={handleChange}
                    >
                      {itemUnits.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.unit && errors.unit && (
                      <FormHelperText>{errors.unit}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={touched.location && Boolean(errors.location)}>
                    <InputLabel id="location-label">Location *</InputLabel>
                    <Select
                      labelId="location-label"
                      id="location"
                      name="location"
                      value={values.location}
                      label="Location *"
                      onChange={handleChange}
                    >
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.id} value={warehouse.name}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.location && errors.location && (
                      <FormHelperText>{errors.location}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="minimumStock"
                    name="minimumStock"
                    label="Minimum Stock Level *"
                    type="number"
                    value={values.minimumStock}
                    onChange={handleChange}
                    error={touched.minimumStock && Boolean(errors.minimumStock)}
                    helperText={touched.minimumStock && errors.minimumStock}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="reorderPoint"
                    name="reorderPoint"
                    label="Reorder Point *"
                    type="number"
                    value={values.reorderPoint}
                    onChange={handleChange}
                    error={touched.reorderPoint && Boolean(errors.reorderPoint)}
                    helperText={touched.reorderPoint && errors.reorderPoint}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="costPerUnit"
                    name="costPerUnit"
                    label="Cost Per Unit *"
                    type="number"
                    value={values.costPerUnit}
                    onChange={handleChange}
                    error={touched.costPerUnit && Boolean(errors.costPerUnit)}
                    helperText={touched.costPerUnit && errors.costPerUnit}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                {/* Batch Tracking */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6">Batch Tracking</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="trackBatches-label">Track Batches</InputLabel>
                    <Select
                      labelId="trackBatches-label"
                      id="trackBatches"
                      name="trackBatches"
                      value={values.trackBatches}
                      label="Track Batches"
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="trackSerials-label">Track Serials</InputLabel>
                    <Select
                      labelId="trackSerials-label"
                      id="trackSerials"
                      name="trackSerials"
                      value={values.trackSerials}
                      label="Track Serials"
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="useBarcode-label">Use Barcode</InputLabel>
                    <Select
                      labelId="useBarcode-label"
                      id="useBarcode"
                      name="useBarcode"
                      value={values.useBarcode}
                      label="Use Barcode"
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="barcodeFormat"
                    name="barcodeFormat"
                    label="Barcode Format"
                    value={values.barcodeFormat}
                    onChange={handleChange}
                    error={touched.barcodeFormat && Boolean(errors.barcodeFormat)}
                    helperText={touched.barcodeFormat && errors.barcodeFormat}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="allowSplit-label">Allow Split</InputLabel>
                    <Select
                      labelId="allowSplit-label"
                      id="allowSplit"
                      name="allowSplit"
                      value={values.allowSplit}
                      label="Allow Split"
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Form Buttons */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleCancel}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      {isSubmitting ? 'Saving...' : isNewItem ? 'Create Item' : 'Update Item'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

      {/* Success Message Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
