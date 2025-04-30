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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { manufacturingOrderAPI } from '../../services/api';

export default function ManufacturingOrdersPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for now - will be replaced with API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        { 
          id: 1, 
          orderNumber: 'MO-2025001', 
          productName: 'Camping Tent - 2-Person', 
          quantity: 50, 
          priority: 'High', 
          status: 'In Progress', 
          startDate: '2025-04-15', 
          dueDate: '2025-05-10',
          completedQuantity: 15,
          assignedTo: 'Production Team A'
        },
        { 
          id: 2, 
          orderNumber: 'MO-2025002', 
          productName: 'Hiking Backpack - 40L', 
          quantity: 100, 
          priority: 'Medium', 
          status: 'Planned', 
          startDate: '2025-04-20', 
          dueDate: '2025-05-15',
          completedQuantity: 0,
          assignedTo: 'Production Team B'
        },
        { 
          id: 3, 
          orderNumber: 'MO-2025003', 
          productName: 'Waterproof Jacket - Large', 
          quantity: 75, 
          priority: 'Medium', 
          status: 'In Progress', 
          startDate: '2025-04-10', 
          dueDate: '2025-05-05',
          completedQuantity: 40,
          assignedTo: 'Production Team A'
        },
        { 
          id: 4, 
          orderNumber: 'MO-2025004', 
          productName: 'Sleeping Bag - Winter', 
          quantity: 30, 
          priority: 'Low', 
          status: 'Completed', 
          startDate: '2025-04-05', 
          dueDate: '2025-04-25',
          completedQuantity: 30,
          assignedTo: 'Production Team C'
        },
        { 
          id: 5, 
          orderNumber: 'MO-2025005', 
          productName: 'Camping Chair', 
          quantity: 120, 
          priority: 'High', 
          status: 'Planned', 
          startDate: '2025-04-25', 
          dueDate: '2025-05-20',
          completedQuantity: 0,
          assignedTo: 'Production Team D'
        },
        { 
          id: 6, 
          orderNumber: 'MO-2025006', 
          productName: 'Trekking Poles - Adjustable', 
          quantity: 60, 
          priority: 'Medium', 
          status: 'On Hold', 
          startDate: '2025-04-12', 
          dueDate: '2025-05-10',
          completedQuantity: 0,
          assignedTo: 'Production Team B'
        },
        { 
          id: 7, 
          orderNumber: 'MO-2025007', 
          productName: 'Camp Stove - Portable', 
          quantity: 40, 
          priority: 'High', 
          status: 'In Progress', 
          startDate: '2025-04-18', 
          dueDate: '2025-05-08',
          completedQuantity: 25,
          assignedTo: 'Production Team C'
        },
        { 
          id: 8, 
          orderNumber: 'MO-2025008', 
          productName: 'Hiking Boots - Size 9', 
          quantity: 80, 
          priority: 'Medium', 
          status: 'Planned', 
          startDate: '2025-04-28', 
          dueDate: '2025-05-25',
          completedQuantity: 0,
          assignedTo: 'Production Team E'
        },
        { 
          id: 9, 
          orderNumber: 'MO-2025009', 
          productName: 'Rain Cover - Backpack', 
          quantity: 150, 
          priority: 'Low', 
          status: 'In Progress', 
          startDate: '2025-04-15', 
          dueDate: '2025-05-05',
          completedQuantity: 70,
          assignedTo: 'Production Team D'
        },
        { 
          id: 10, 
          orderNumber: 'MO-2025010', 
          productName: 'Tent Footprint - Medium', 
          quantity: 100, 
          priority: 'Low', 
          status: 'Completed', 
          startDate: '2025-04-01', 
          dueDate: '2025-04-20',
          completedQuantity: 100,
          assignedTo: 'Production Team A'
        },
        { 
          id: 11, 
          orderNumber: 'MO-2025011', 
          productName: 'Headlamp - LED', 
          quantity: 200, 
          priority: 'Medium', 
          status: 'In Progress', 
          startDate: '2025-04-10', 
          dueDate: '2025-05-01',
          completedQuantity: 120,
          assignedTo: 'Production Team E'
        },
        { 
          id: 12, 
          orderNumber: 'MO-2025012', 
          productName: 'Camping Hammock', 
          quantity: 25, 
          priority: 'High', 
          status: 'On Hold', 
          startDate: '2025-04-22', 
          dueDate: '2025-05-15',
          completedQuantity: 0,
          assignedTo: 'Production Team C'
        },
      ];
      
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);

    // In real implementation, would use:
    // const fetchOrders = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await manufacturingOrderAPI.getAllManufacturingOrders();
    //     setOrders(response.data);
    //     setFilteredOrders(response.data);
    //   } catch (error) {
    //     console.error('Error fetching manufacturing orders:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchOrders();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(order => order.priority === priorityFilter);
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      result = result.filter(
        order => 
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, priorityFilter, orders]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
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
    
    // In real implementation:
    // fetchOrders();
  };

  const handleViewOrder = (id) => {
    navigate(`/manufacturing/orders/${id}`);
  };

  const handleEditOrder = (id, event) => {
    event.stopPropagation();
    navigate(`/manufacturing/orders/${id}/edit`);
  };

  const handleDeleteOrder = (id, event) => {
    event.stopPropagation();
    // Add delete confirmation logic here
    console.log(`Delete order ${id}`);
    
    // In real implementation:
    // const deleteOrder = async () => {
    //   try {
    //     await manufacturingOrderAPI.deleteManufacturingOrder(id);
    //     setOrders(orders.filter(order => order.id !== id));
    //   } catch (error) {
    //     console.error('Error deleting order:', error);
    //   }
    // };
  };

  const handleAddOrder = () => {
    navigate('/manufacturing/orders/new');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Get status color based on status value
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Planned':
        return 'info';
      case 'On Hold':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  // Calculate progress percentage
  const calculateProgress = (completed, total) => {
    return (completed / total) * 100;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Manufacturing Orders
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddOrder}
        >
          Create New Order
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search Orders"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mr: 2, flexGrow: 1 }}
            InputProps={{
              endAdornment: <SearchIcon color="action" />
            }}
          />
          <Tooltip title="Toggle Filters">
            <IconButton onClick={toggleFilters}>
              <FilterIcon color={showFilters ? "primary" : "action"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        
        {showFilters && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Planned">Planned</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={handlePriorityFilterChange}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id} hover onClick={() => handleViewOrder(order.id)} sx={{ cursor: 'pointer' }}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell align="right">{order.quantity}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.priority} 
                        color={getPriorityColor(order.priority)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={getStatusColor(order.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {order.completedQuantity} of {order.quantity} 
                      ({calculateProgress(order.completedQuantity, order.quantity).toFixed(0)}%)
                    </TableCell>
                    <TableCell>{order.startDate}</TableCell>
                    <TableCell>{order.dueDate}</TableCell>
                    <TableCell>{order.assignedTo}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrder(order.id);
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small"
                            onClick={(e) => handleEditOrder(order.id, e)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={(e) => handleDeleteOrder(order.id, e)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {loading ? 'Loading orders...' : 'No manufacturing orders found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredOrders.length}
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
