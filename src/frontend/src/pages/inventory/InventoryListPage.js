import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';

export default function InventoryListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data for now - will be replaced with API call
  useEffect(() => {
    const mockItems = [
      { id: 1, sku: 'FAB-001', name: 'Cotton Fabric - Blue', category: 'Raw Material', quantity: 250, unit: 'meters', status: 'In Stock', location: 'Warehouse A', lastUpdated: '2025-04-20' },
      { id: 2, sku: 'FAB-002', name: 'Cotton Fabric - Red', category: 'Raw Material', quantity: 180, unit: 'meters', status: 'In Stock', location: 'Warehouse A', lastUpdated: '2025-04-18' },
      { id: 3, sku: 'FAB-003', name: 'Polyester Fabric - Black', category: 'Raw Material', quantity: 300, unit: 'meters', status: 'In Stock', location: 'Warehouse B', lastUpdated: '2025-04-22' },
      { id: 4, sku: 'BTN-001', name: 'Metal Buttons - Silver', category: 'Component', quantity: 1500, unit: 'pcs', status: 'In Stock', location: 'Warehouse A', lastUpdated: '2025-04-15' },
      { id: 5, sku: 'ZPR-001', name: 'Zipper - Black (20cm)', category: 'Component', quantity: 750, unit: 'pcs', status: 'Low Stock', location: 'Warehouse A', lastUpdated: '2025-04-17' },
      { id: 6, sku: 'THR-001', name: 'Thread - Black', category: 'Raw Material', quantity: 100, unit: 'spools', status: 'In Stock', location: 'Warehouse C', lastUpdated: '2025-04-19' },
      { id: 7, sku: 'THR-002', name: 'Thread - White', category: 'Raw Material', quantity: 85, unit: 'spools', status: 'Low Stock', location: 'Warehouse C', lastUpdated: '2025-04-19' },
      { id: 8, sku: 'LBL-001', name: 'Care Labels - Standard', category: 'Component', quantity: 5000, unit: 'pcs', status: 'In Stock', location: 'Warehouse B', lastUpdated: '2025-04-16' },
      { id: 9, sku: 'PKG-001', name: 'Packaging Boxes - Small', category: 'Packaging', quantity: 350, unit: 'pcs', status: 'In Stock', location: 'Warehouse D', lastUpdated: '2025-04-21' },
      { id: 10, sku: 'LTH-001', name: 'Leather - Black', category: 'Raw Material', quantity: 30, unit: 'sq.m', status: 'Low Stock', location: 'Warehouse B', lastUpdated: '2025-04-18' },
      { id: 11, sku: 'FST-001', name: 'Foam Padding', category: 'Raw Material', quantity: 200, unit: 'sheets', status: 'In Stock', location: 'Warehouse D', lastUpdated: '2025-04-23' },
      { id: 12, sku: 'PRD-001', name: 'Backpack - Finished', category: 'Finished Good', quantity: 75, unit: 'pcs', status: 'In Stock', location: 'Warehouse E', lastUpdated: '2025-04-24' },
    ];
    
    setItems(mockItems);
    setFilteredItems(mockItems);
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        item => 
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleViewItem = (id) => {
    navigate(`/inventory/items/${id}`);
  };

  const handleAddItem = () => {
    navigate('/inventory/items/new');
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Inventory Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          Add New Item
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search Items"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mr: 2, flexGrow: 1 }}
            InputProps={{
              endAdornment: <SearchIcon color="action" />
            }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id} hover onClick={() => handleViewItem(item.id)} sx={{ cursor: 'pointer' }}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status} 
                        color={getStatusColor(item.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/inventory/items/${item.id}/edit`);
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
                              // Add delete confirmation logic here
                              console.log(`Delete item ${item.id}`);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredItems.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}
