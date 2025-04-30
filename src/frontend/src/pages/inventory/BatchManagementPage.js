import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Breadcrumbs,
  Link,
  Chip,
  Tooltip,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon,
  Save as SaveIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';

// Mock data helper: Get specific item by ID
const getMockItemById = (id) => {
  const mockItems = [
    {
      id: 1,
      sku: 'FAB-001',
      name: 'Cotton Fabric - Blue',
      category: 'Raw Material',
      unit: 'meters',
      location: 'Warehouse A',
      trackBatches: true,
      trackSerials: false,
      allowSplit: true
    }
  ];
  
  return mockItems.find(item => item.id === parseInt(id)) || null;
};

// Mock data for batch information
const getMockBatches = (itemId) => {
  if (itemId === 1) {
    return [
      {
        id: 'BT-001',
        itemId: 1,
        batchNumber: 'LOT-2025-04-15-001',
        receivedDate: '2025-04-15',
        supplierBatchNumber: 'SUP-12345',
        quantity: 250,
        remainingQuantity: 250,
        status: 'In Stock',
        location: 'Warehouse A',
        expirationDate: '2026-04-15',
        notes: 'High-quality cotton fabric batch from Textile Industries Ltd.'
      },
      {
        id: 'BT-002',
        itemId: 1,
        batchNumber: 'LOT-2025-04-20-001',
        receivedDate: '2025-04-20',
        supplierBatchNumber: 'SUP-12346',
        quantity: 180,
        remainingQuantity: 180,
        status: 'In Stock',
        location: 'Warehouse A',
        expirationDate: '2026-04-20',
        notes: 'Regular order from Textile Industries Ltd.'
      },
      {
        id: 'BT-003',
        itemId: 1,
        batchNumber: 'LOT-2025-04-25-001',
        receivedDate: '2025-04-25',
        supplierBatchNumber: 'SUP-12350',
        quantity: 300,
        remainingQuantity: 300,
        status: 'Quality Check',
        location: 'QC Area',
        expirationDate: '2026-04-25',
        notes: 'Pending quality inspection'
      }
    ];
  }
  return [];
};

// Mock data for items within a batch (e.g., fabric rolls)
const getMockBatchItems = (batchId) => {
  if (batchId === 'BT-001') {
    return [
      {
        id: 'ROLL-001',
        batchId: 'BT-001',
        serialNumber: 'SN-FAB001-001',
        quantity: 48.5,
        status: 'In Stock',
        location: 'Warehouse A - Rack 3',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-002',
        batchId: 'BT-001',
        serialNumber: 'SN-FAB001-002',
        quantity: 50.0,
        status: 'In Stock',
        location: 'Warehouse A - Rack 3',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-003',
        batchId: 'BT-001',
        serialNumber: 'SN-FAB001-003',
        quantity: 49.5,
        status: 'In Stock',
        location: 'Warehouse A - Rack 3',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-004',
        batchId: 'BT-001',
        serialNumber: 'SN-FAB001-004',
        quantity: 52.0,
        status: 'In Stock',
        location: 'Warehouse A - Rack 3',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-005',
        batchId: 'BT-001',
        serialNumber: 'SN-FAB001-005',
        quantity: 50.0,
        status: 'In Stock',
        location: 'Warehouse A - Rack 3',
        notes: 'Roll width: 1.5m'
      }
    ];
  }
  if (batchId === 'BT-002') {
    return [
      {
        id: 'ROLL-006',
        batchId: 'BT-002',
        serialNumber: 'SN-FAB001-006',
        quantity: 45.0,
        status: 'In Stock',
        location: 'Warehouse A - Rack 4',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-007',
        batchId: 'BT-002',
        serialNumber: 'SN-FAB001-007',
        quantity: 45.0,
        status: 'In Stock',
        location: 'Warehouse A - Rack 4',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-008',
        batchId: 'BT-002',
        serialNumber: 'SN-FAB001-008',
        quantity: 45.0,
        status: 'In Stock',
        location: 'Warehouse A - Rack 4',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-009',
        batchId: 'BT-002',
        serialNumber: 'SN-FAB001-009',
        quantity: 45.0,
        status: 'In Stock',
        location: 'Warehouse A - Rack 4',
        notes: 'Roll width: 1.5m'
      }
    ];
  }
  if (batchId === 'BT-003') {
    return [
      {
        id: 'ROLL-010',
        batchId: 'BT-003',
        serialNumber: 'SN-FAB001-010',
        quantity: 50.0,
        status: 'Quality Check',
        location: 'QC Area',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-011',
        batchId: 'BT-003',
        serialNumber: 'SN-FAB001-011',
        quantity: 50.0,
        status: 'Quality Check',
        location: 'QC Area',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-012',
        batchId: 'BT-003',
        serialNumber: 'SN-FAB001-012',
        quantity: 50.0,
        status: 'Quality Check',
        location: 'QC Area',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-013',
        batchId: 'BT-003',
        serialNumber: 'SN-FAB001-013',
        quantity: 50.0,
        status: 'Quality Check',
        location: 'QC Area',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-014',
        batchId: 'BT-003',
        serialNumber: 'SN-FAB001-014',
        quantity: 50.0,
        status: 'Quality Check',
        location: 'QC Area',
        notes: 'Roll width: 1.5m'
      },
      {
        id: 'ROLL-015',
        batchId: 'BT-003',
        serialNumber: 'SN-FAB001-015',
        quantity: 50.0,
        status: 'Quality Check',
        location: 'QC Area',
        notes: 'Roll width: 1.5m'
      }
    ];
  }
  return [];
};

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`batch-tabpanel-${index}`}
      aria-labelledby={`batch-tab-${index}`}
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

export default function BatchManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchItems, setBatchItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  const [openSplitDialog, setOpenSplitDialog] = useState(false);
  const [splitQuantity, setSplitQuantity] = useState('');
  const [itemToSplit, setItemToSplit] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const fetchedItem = getMockItemById(parseInt(id));
        if (fetchedItem) {
          setItem(fetchedItem);
          
          if (fetchedItem.trackBatches) {
            const fetchedBatches = getMockBatches(fetchedItem.id);
            setBatches(fetchedBatches);
            
            if (fetchedBatches.length > 0) {
              setSelectedBatch(fetchedBatches[0]);
              setBatchItems(getMockBatchItems(fetchedBatches[0].id));
            }
          } else {
            setError("This item does not support batch tracking");
          }
        } else {
          setError("Item not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Error loading batch information");
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectBatch = (batch) => {
    setSelectedBatch(batch);
    setBatchItems(getMockBatchItems(batch.id));
    setTabValue(0); // Reset to first tab
  };

  const handleSplitClick = (item) => {
    setItemToSplit(item);
    setSplitQuantity('');
    setOpenSplitDialog(true);
  };

  const handleSplitDialogClose = () => {
    setOpenSplitDialog(false);
    setItemToSplit(null);
  };

  const handleSplitConfirm = () => {
    // Here you would implement the actual split logic
    // For this demo, we'll just show a message
    console.log(`Split ${itemToSplit.serialNumber} into ${splitQuantity} meters`);
    handleSplitDialogClose();
  };

  const handleAddNewBatch = () => {
    // Navigate to batch creation page
    navigate(`/inventory/items/${id}/batches/new`);
  };

  const handleAddNewRoll = () => {
    // Navigate to roll/serial creation page
    if (selectedBatch) {
      navigate(`/inventory/items/${id}/batches/${selectedBatch.id}/rolls/new`);
    }
  };

  const handleBack = () => {
    navigate(`/inventory/items/${id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      case 'Quality Check':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Batch Management
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
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Item Details
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
        <Link 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/inventory/items')}
        >
          Items
        </Link>
        <Link 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleBack}
        >
          {item.name}
        </Link>
        <Typography color="text.primary">Batch Management</Typography>
      </Breadcrumbs>

      {/* Header */}
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
            Batch Management: {item.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewBatch}
        >
          Add New Batch
        </Button>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Batches List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Batches
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {batches.length === 0 ? (
              <Alert severity="info">No batches found for this item</Alert>
            ) : (
              batches.map((batch) => (
                <Paper 
                  key={batch.id} 
                  elevation={selectedBatch?.id === batch.id ? 3 : 1}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    cursor: 'pointer',
                    border: selectedBatch?.id === batch.id ? '1px solid' : '1px solid transparent',
                    borderColor: selectedBatch?.id === batch.id ? 'primary.main' : 'divider',
                    bgcolor: selectedBatch?.id === batch.id ? 'action.hover' : 'background.paper'
                  }}
                  onClick={() => handleSelectBatch(batch)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" component="div">
                      {batch.batchNumber}
                    </Typography>
                    <Chip 
                      label={batch.status} 
                      size="small" 
                      color={getStatusColor(batch.status)} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Received: {batch.receivedDate}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">
                      Quantity: {batch.remainingQuantity} / {batch.quantity} {item.unit}
                    </Typography>
                    <Typography variant="body2">
                      Location: {batch.location}
                    </Typography>
                  </Box>
                </Paper>
              ))
            )}
          </Paper>
        </Grid>
        
        {/* Right Column - Batch Details */}
        <Grid item xs={12} md={8}>
          {selectedBatch ? (
            <Paper sx={{ p: 2 }}>
              {/* Batch Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Batch Details: {selectedBatch.batchNumber}
                </Typography>
                <Box>
                  <Tooltip title="Print Labels">
                    <IconButton color="primary" sx={{ mr: 1 }}>
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Generate QR Code">
                    <IconButton color="primary">
                      <QrCodeIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {/* Batch Info Summary */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Supplier Batch #</Typography>
                  <Typography variant="body1">{selectedBatch.supplierBatchNumber}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Received Date</Typography>
                  <Typography variant="body1">{selectedBatch.receivedDate}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Expiration Date</Typography>
                  <Typography variant="body1">{selectedBatch.expirationDate}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={selectedBatch.status} 
                    size="small" 
                    color={getStatusColor(selectedBatch.status)} 
                  />
                </Grid>
              </Grid>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Batch Items" icon={<InventoryIcon />} />
                  <Tab label="Movements" icon={<ShippingIcon />} />
                </Tabs>
              </Box>

              {/* Batch Items Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    {selectedBatch.batchNumber} contains {batchItems.length} rolls
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddNewRoll}
                    size="small"
                  >
                    Add Roll
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Serial Number</TableCell>
                        <TableCell align="right">Quantity ({item.unit})</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {batchItems.map((batchItem) => (
                        <TableRow key={batchItem.id}>
                          <TableCell>{batchItem.serialNumber}</TableCell>
                          <TableCell align="right">{batchItem.quantity}</TableCell>
                          <TableCell>
                            <Chip 
                              label={batchItem.status} 
                              size="small" 
                              color={getStatusColor(batchItem.status)} 
                            />
                          </TableCell>
                          <TableCell>{batchItem.location}</TableCell>
                          <TableCell>{batchItem.notes}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <Tooltip title="Split Roll">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleSplitClick(batchItem)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Print Label">
                                <IconButton size="small">
                                  <PrintIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Movements Tab */}
              <TabPanel value={tabValue} index={1}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  No batch movements recorded yet.
                </Alert>
                <Typography variant="body1">
                  This tab will display all movements for this batch, including:
                </Typography>
                <ul>
                  <li>Receipts from suppliers</li>
                  <li>Transfers between locations</li>
                  <li>Usage in production</li>
                  <li>Quality adjustments</li>
                  <li>Batch splits</li>
                </ul>
              </TabPanel>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Select a batch from the list to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Split Dialog */}
      <Dialog open={openSplitDialog} onClose={handleSplitDialogClose}>
        <DialogTitle>Split Fabric Roll</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the quantity to split from roll {itemToSplit?.serialNumber}. Current roll quantity is {itemToSplit?.quantity} {item?.unit}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="splitQuantity"
            label={`Split Quantity (${item?.unit})`}
            type="number"
            fullWidth
            variant="outlined"
            value={splitQuantity}
            onChange={(e) => setSplitQuantity(e.target.value)}
            InputProps={{
              inputProps: { 
                min: 0.1, 
                max: itemToSplit?.quantity - 0.1,
                step: 0.1
              }
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSplitDialogClose}>Cancel</Button>
          <Button onClick={handleSplitConfirm} variant="contained">Split Roll</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
