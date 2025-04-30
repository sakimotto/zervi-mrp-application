import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';

// Mock Data Helper
const getMockItem = (id) => {
  const mockItems = [
    { id: 1, sku: 'FAB-001', name: 'Cotton Fabric - Blue', category: 'Raw Material', quantity: 250, unit: 'meters', status: 'In Stock', location: 'Warehouse A', lastUpdated: '2025-04-20', description: 'High-quality cotton fabric in blue color. Used for manufacturing bags and clothing items.', costPerUnit: 5.75, supplier: 'Textile Industries Ltd.', minimumStock: 50, reorderPoint: 75, image: null },
    { id: 2, sku: 'FAB-002', name: 'Cotton Fabric - Red', category: 'Raw Material', quantity: 180, unit: 'meters', status: 'In Stock', location: 'Warehouse A', lastUpdated: '2025-04-18', description: 'High-quality cotton fabric in red color. Used for manufacturing bags and clothing items.', costPerUnit: 5.75, supplier: 'Textile Industries Ltd.', minimumStock: 50, reorderPoint: 75, image: null },
    { id: 3, sku: 'FAB-003', name: 'Polyester Fabric - Black', category: 'Raw Material', quantity: 300, unit: 'meters', status: 'In Stock', location: 'Warehouse B', lastUpdated: '2025-04-22', description: 'Durable polyester fabric in black. Water-resistant and suitable for outdoor products.', costPerUnit: 4.50, supplier: 'Synthetic Materials Co.', minimumStock: 75, reorderPoint: 100, image: null },
    { id: 4, sku: 'BTN-001', name: 'Metal Buttons - Silver', category: 'Component', quantity: 1500, unit: 'pcs', status: 'In Stock', location: 'Warehouse A', lastUpdated: '2025-04-15', description: 'Silver metal buttons, 15mm diameter. Used for jackets and bags.', costPerUnit: 0.25, supplier: 'Hardware Supply Inc.', minimumStock: 300, reorderPoint: 500, image: null },
    { id: 5, sku: 'ZPR-001', name: 'Zipper - Black (20cm)', category: 'Component', quantity: 750, unit: 'pcs', status: 'Low Stock', location: 'Warehouse A', lastUpdated: '2025-04-17', description: 'Black nylon zippers, 20cm length. Used for various bag compartments.', costPerUnit: 0.45, supplier: 'Hardware Supply Inc.', minimumStock: 800, reorderPoint: 1000, image: null },
  ];
  
  return mockItems.find(item => item.id === parseInt(id)) || null;
};

// Mock transaction history data
const getMockTransactions = () => {
  return [
    { id: 101, date: '2025-04-25', type: 'Received', quantity: 100, reference: 'PO-1234', notes: 'Regular order from supplier' },
    { id: 102, date: '2025-04-22', type: 'Consumed', quantity: -25, reference: 'MO-5678', notes: 'Used in production' },
    { id: 103, date: '2025-04-18', type: 'Received', quantity: 50, reference: 'PO-1200', notes: 'Rush order' },
    { id: 104, date: '2025-04-15', type: 'Consumed', quantity: -15, reference: 'MO-5645', notes: 'Used in production' },
    { id: 105, date: '2025-04-10', type: 'Inventory Adjustment', quantity: -10, reference: 'ADJ-123', notes: 'Damaged inventory' }
  ];
};

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`item-tabpanel-${index}`}
      aria-labelledby={`item-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        const fetchedItem = getMockItem(id);
        if (fetchedItem) {
          setItem(fetchedItem);
          setTransactions(getMockTransactions());
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
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/inventory');
  };

  const handleEdit = () => {
    navigate(`/inventory/items/${id}/edit`);
  };

  const handleDelete = () => {
    // Add delete confirmation logic here
    console.log(`Delete item ${id}`);
    navigate('/inventory');
  };

  // Get status color based on status value
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Inventory
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
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
        <Typography color="text.primary">{item.name}</Typography>
      </Breadcrumbs>

      {/* Header with actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" component="h1">
            Item Details: {item.name}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Item Overview */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">SKU</Typography>
                <Typography variant="body1">{item.sku}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{item.name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                <Typography variant="body1">{item.category}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={item.status} 
                  color={getStatusColor(item.status)} 
                  size="small" 
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                <Typography variant="body1">{item.lastUpdated}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1">{item.description}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Inventory Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Current Quantity</Typography>
                <Typography variant="body1">{item.quantity} {item.unit}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Minimum Stock</Typography>
                <Typography variant="body1">{item.minimumStock} {item.unit}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Reorder Point</Typography>
                <Typography variant="body1">{item.reorderPoint} {item.unit}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{item.location}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Cost Per Unit</Typography>
                <Typography variant="body1">${item.costPerUnit.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="text.secondary">Total Value</Typography>
                <Typography variant="body1">${(item.quantity * item.costPerUnit).toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Supplier</Typography>
                <Typography variant="body1">{item.supplier}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for Different Sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<HistoryIcon />} label="Transaction History" />
          <Tab icon={<AssignmentIcon />} label="Used In BOM" />
          <Tab icon={<ShippingIcon />} label="Suppliers" />
        </Tabs>

        {/* Transaction History Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.type} 
                        color={transaction.quantity > 0 ? 'success' : transaction.type === 'Inventory Adjustment' ? 'warning' : 'primary'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ color: transaction.quantity > 0 ? 'success.main' : 'error.main' }}>
                      {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity} {item.unit}
                    </TableCell>
                    <TableCell>{transaction.reference}</TableCell>
                    <TableCell>{transaction.notes}</TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No transaction history available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Used In BOM Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">This item is used in the following Bills of Materials:</Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              No BOM records found for this item
            </Alert>
          </Box>
        </TabPanel>

        {/* Suppliers Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Primary Supplier</Typography>
            <Typography variant="body1">{item.supplier}</Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Alternative Suppliers</Typography>
            <Alert severity="info">
              No alternative suppliers have been defined for this item
            </Alert>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
