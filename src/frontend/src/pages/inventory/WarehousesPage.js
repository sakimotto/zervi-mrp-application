import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  LinearProgress,
  Breadcrumbs,
  Link,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warehouse as WarehouseIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

// Mock warehouse data
const getMockWarehouses = () => {
  return [
    { 
      id: 'A', 
      name: 'Warehouse A', 
      location: '123 Main St, Building 1, Seattle, WA', 
      capacity: 10000,
      used: 8500,
      manager: 'Alice Johnson',
      sections: 5,
      description: 'Main raw materials warehouse. Climate controlled with specialized fabric storage.',
      lastUpdated: '2025-04-15'
    },
    { 
      id: 'B', 
      name: 'Warehouse B', 
      location: '123 Main St, Building 2, Seattle, WA', 
      capacity: 8000,
      used: 5800,
      manager: 'Bob Smith',
      sections: 4,
      description: 'Components and small parts storage. Features high-density storage systems.',
      lastUpdated: '2025-04-18'
    },
    { 
      id: 'C', 
      name: 'Warehouse C', 
      location: '456 Industrial Ave, Seattle, WA', 
      capacity: 5000,
      used: 2250,
      manager: 'Carol Williams',
      sections: 3,
      description: 'Specialized materials and sensitive components. Temperature and humidity controlled.',
      lastUpdated: '2025-04-20'
    },
    { 
      id: 'D', 
      name: 'Warehouse D', 
      location: '789 Distribution Blvd, Tacoma, WA', 
      capacity: 12000,
      used: 7500,
      manager: 'David Miller',
      sections: 8,
      description: 'Main distribution center. Features loading docks and bulk storage areas.',
      lastUpdated: '2025-04-12'
    },
    { 
      id: 'E', 
      name: 'Warehouse E', 
      location: '321 Production Way, Seattle, WA', 
      capacity: 6000,
      used: 5500,
      manager: 'Emily Davis',
      sections: 4,
      description: 'Finished goods storage. Connected to production facility for easy transfer.',
      lastUpdated: '2025-04-17'
    }
  ];
};

// Mock data for warehouse capacity breakdown
const getWarehouseSections = (warehouseId) => {
  const sections = {
    'A': [
      { id: 'A1', name: 'Fabrics', capacity: 3000, used: 2800 },
      { id: 'A2', name: 'Leathers', capacity: 2000, used: 1600 },
      { id: 'A3', name: 'Specialty Materials', capacity: 2000, used: 1500 },
      { id: 'A4', name: 'Bulk Raw Materials', capacity: 2000, used: 1800 },
      { id: 'A5', name: 'Incoming Materials', capacity: 1000, used: 800 }
    ],
    'B': [
      { id: 'B1', name: 'Metal Components', capacity: 2000, used: 1500 },
      { id: 'B2', name: 'Plastic Components', capacity: 2000, used: 1200 },
      { id: 'B3', name: 'Fasteners & Hardware', capacity: 2000, used: 1800 },
      { id: 'B4', name: 'Labels & Packaging', capacity: 2000, used: 1300 }
    ],
    'C': [
      { id: 'C1', name: 'Adhesives', capacity: 1500, used: 700 },
      { id: 'C2', name: 'Threads & Trims', capacity: 2000, used: 950 },
      { id: 'C3', name: 'Specialty Components', capacity: 1500, used: 600 }
    ],
    'D': [
      { id: 'D1', name: 'Bulk Storage', capacity: 4000, used: 3000 },
      { id: 'D2', name: 'Packaging Materials', capacity: 2000, used: 1200 },
      { id: 'D3', name: 'Shipping Supplies', capacity: 1000, used: 700 },
      { id: 'D4', name: 'Outdoor Equipment', capacity: 1000, used: 600 },
      { id: 'D5', name: 'Camping Gear', capacity: 1000, used: 700 },
      { id: 'D6', name: 'Automotive Parts', capacity: 1000, used: 500 },
      { id: 'D7', name: 'Overstock', capacity: 1000, used: 400 },
      { id: 'D8', name: 'Returns', capacity: 1000, used: 400 }
    ],
    'E': [
      { id: 'E1', name: 'Camping Products', capacity: 1500, used: 1400 },
      { id: 'E2', name: 'Apparel', capacity: 1500, used: 1300 },
      { id: 'E3', name: 'Automotive Accessories', capacity: 1500, used: 1400 },
      { id: 'E4', name: 'Zervitek Products', capacity: 1500, used: 1400 }
    ]
  };
  
  return sections[warehouseId] || [];
};

export default function WarehousesPage() {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseSections, setWarehouseSections] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const data = getMockWarehouses();
      setWarehouses(data);
      setFilteredWarehouses(data);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredWarehouses(warehouses);
    } else {
      const filtered = warehouses.filter(
        warehouse => 
          warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWarehouses(filtered);
    }
  }, [searchTerm, warehouses]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      const data = getMockWarehouses();
      setWarehouses(data);
      setFilteredWarehouses(data);
      setLoading(false);
    }, 800);
  };

  const handleWarehouseSelect = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseSections(getWarehouseSections(warehouse.id));
  };

  const handleBackToList = () => {
    setSelectedWarehouse(null);
    setWarehouseSections([]);
  };

  const handleAddWarehouse = () => {
    // Would navigate to warehouse creation form
    console.log('Add warehouse');
  };

  const handleEditWarehouse = (id) => {
    // Would navigate to warehouse edit form
    console.log(`Edit warehouse ${id}`);
  };

  const handleDeleteConfirmOpen = (warehouse) => {
    setWarehouseToDelete(warehouse);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmClose = () => {
    setOpenDeleteDialog(false);
    setWarehouseToDelete(null);
  };

  const handleDeleteWarehouse = () => {
    // Would send delete request to API
    console.log(`Delete warehouse ${warehouseToDelete.id}`);
    
    // Simulate deletion locally
    const updatedWarehouses = warehouses.filter(
      warehouse => warehouse.id !== warehouseToDelete.id
    );
    setWarehouses(updatedWarehouses);
    setFilteredWarehouses(updatedWarehouses);
    
    handleDeleteConfirmClose();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Warehouse Management
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (selectedWarehouse) {
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
            onClick={handleBackToList}
          >
            Warehouses
          </Link>
          <Typography color="text.primary">{selectedWarehouse.name}</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBackToList}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h5" component="h1">
              {selectedWarehouse.name}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => handleEditWarehouse(selectedWarehouse.id)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteConfirmOpen(selectedWarehouse)}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Warehouse Details */}
        <Paper sx={{ mb: 3, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Warehouse Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="text.secondary">ID</Typography>
                  <Typography variant="body1">{selectedWarehouse.id}</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{selectedWarehouse.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{selectedWarehouse.location}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Manager</Typography>
                  <Typography variant="body1">{selectedWarehouse.manager}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1">{selectedWarehouse.lastUpdated}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selectedWarehouse.description}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Capacity Overview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="text.secondary">Total Capacity</Typography>
                  <Typography variant="body1">{selectedWarehouse.capacity.toLocaleString()} cubic ft</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="text.secondary">Used Space</Typography>
                  <Typography variant="body1">{selectedWarehouse.used.toLocaleString()} cubic ft</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="text.secondary">Available</Typography>
                  <Typography variant="body1">
                    {(selectedWarehouse.capacity - selectedWarehouse.used).toLocaleString()} cubic ft
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Utilization</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(selectedWarehouse.used / selectedWarehouse.capacity) * 100} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          bgcolor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 
                              (selectedWarehouse.used / selectedWarehouse.capacity) > 0.9 ? 'error.main' :
                              (selectedWarehouse.used / selectedWarehouse.capacity) > 0.7 ? 'warning.main' :
                              'success.main'
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round((selectedWarehouse.used / selectedWarehouse.capacity) * 100)}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Warehouse Sections */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Warehouse Sections
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Section ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Capacity (cubic ft)</TableCell>
                  <TableCell align="right">Used (cubic ft)</TableCell>
                  <TableCell align="right">Available (cubic ft)</TableCell>
                  <TableCell>Utilization</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouseSections.map((section) => {
                  const utilizationPercent = (section.used / section.capacity) * 100;
                  const availableSpace = section.capacity - section.used;
                  
                  return (
                    <TableRow key={section.id} hover>
                      <TableCell>{section.id}</TableCell>
                      <TableCell>{section.name}</TableCell>
                      <TableCell align="right">{section.capacity.toLocaleString()}</TableCell>
                      <TableCell align="right">{section.used.toLocaleString()}</TableCell>
                      <TableCell align="right">{availableSpace.toLocaleString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={utilizationPercent} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 5,
                                bgcolor: 'background.paper',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: 
                                    utilizationPercent > 90 ? 'error.main' :
                                    utilizationPercent > 70 ? 'warning.main' :
                                    'success.main'
                                }
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {Math.round(utilizationPercent)}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
        <Typography color="text.primary">Warehouses</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Warehouse Management
        </Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddWarehouse}
          >
            Add Warehouse
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Search Warehouses"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
      </Paper>

      {/* Warehouses Grid */}
      <Grid container spacing={3}>
        {filteredWarehouses.map((warehouse) => {
          const utilizationPercent = (warehouse.used / warehouse.capacity) * 100;
          const availableSpace = warehouse.capacity - warehouse.used;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={warehouse.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {warehouse.name}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditWarehouse(warehouse.id);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConfirmOpen(warehouse);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {warehouse.location}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Capacity: {warehouse.capacity.toLocaleString()} cubic ft
                  </Typography>
                  
                  <Box sx={{ mt: 1.5, mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Utilization ({Math.round(utilizationPercent)}%)
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={utilizationPercent} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        bgcolor: 'background.paper',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 
                            utilizationPercent > 90 ? 'error.main' :
                            utilizationPercent > 70 ? 'warning.main' :
                            'success.main'
                        }
                      }}
                    />
                  </Box>
                  
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Used</Typography>
                      <Typography variant="body1">{warehouse.used.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Available</Typography>
                      <Typography variant="body1">{availableSpace.toLocaleString()}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleWarehouseSelect(warehouse)}
                    endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
        
        {filteredWarehouses.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">No warehouses found</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteConfirmClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {warehouseToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button onClick={handleDeleteWarehouse} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
