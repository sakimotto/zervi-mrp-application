import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { manufacturingOrderAPI } from '../../services/api';

export default function ProductionSchedulePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const [workstationFilter, setWorkstationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data for workstations
  const workstations = [
    { id: 1, name: 'Cutting Station 1', type: 'cutting' },
    { id: 2, name: 'Cutting Station 2', type: 'cutting' },
    { id: 3, name: 'Sewing Station 1', type: 'sewing' },
    { id: 4, name: 'Sewing Station 2', type: 'sewing' },
    { id: 5, name: 'Laminating Station', type: 'laminating' },
    { id: 6, name: 'Embroidery Station', type: 'embroidery' },
  ];

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // const response = await manufacturingOrderAPI.getAllManufacturingOrders();
        // setOrders(response.data);
        
        // Mock data
        setTimeout(() => {
          const mockOrders = [
            {
              id: 1,
              orderNumber: 'MO-2025001',
              productName: 'Camping Tent - 2-Person',
              quantity: 50,
              priority: 'High',
              status: 'In Progress',
              startDate: '2025-05-01',
              dueDate: '2025-05-10',
              completedQuantity: 15,
              assignedTo: 'Production Team A',
              workstationId: 1,
              operations: [
                { id: 1, name: 'Cutting', startDate: '2025-05-01', endDate: '2025-05-03', status: 'Completed', workstationId: 1 },
                { id: 2, name: 'Sewing', startDate: '2025-05-03', endDate: '2025-05-07', status: 'In Progress', workstationId: 3 },
                { id: 3, name: 'Quality Check', startDate: '2025-05-07', endDate: '2025-05-09', status: 'Not Started', workstationId: null },
              ]
            },
            {
              id: 2,
              orderNumber: 'MO-2025002',
              productName: 'Hiking Backpack - 40L',
              quantity: 100,
              priority: 'Medium',
              status: 'Planned',
              startDate: '2025-05-04',
              dueDate: '2025-05-15',
              completedQuantity: 0,
              assignedTo: 'Production Team B',
              workstationId: 2,
              operations: [
                { id: 4, name: 'Cutting', startDate: '2025-05-04', endDate: '2025-05-07', status: 'Planned', workstationId: 2 },
                { id: 5, name: 'Sewing', startDate: '2025-05-08', endDate: '2025-05-12', status: 'Planned', workstationId: 4 },
                { id: 6, name: 'Quality Check', startDate: '2025-05-13', endDate: '2025-05-14', status: 'Planned', workstationId: null },
              ]
            },
            {
              id: 3,
              orderNumber: 'MO-2025003',
              productName: 'Waterproof Jacket - Large',
              quantity: 75,
              priority: 'Medium',
              status: 'In Progress',
              startDate: '2025-04-28',
              dueDate: '2025-05-05',
              completedQuantity: 40,
              assignedTo: 'Production Team A',
              workstationId: 5,
              operations: [
                { id: 7, name: 'Cutting', startDate: '2025-04-28', endDate: '2025-04-30', status: 'Completed', workstationId: 1 },
                { id: 8, name: 'Laminating', startDate: '2025-05-01', endDate: '2025-05-03', status: 'In Progress', workstationId: 5 },
                { id: 9, name: 'Sewing', startDate: '2025-05-03', endDate: '2025-05-05', status: 'Not Started', workstationId: 3 },
              ]
            },
          ];
          
          setOrders(mockOrders);
          setFilteredOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...orders];
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    if (workstationFilter !== 'all') {
      const workstationId = parseInt(workstationFilter);
      result = result.filter(order =>
        order.workstationId === workstationId ||
        order.operations.some(op => op.workstationId === workstationId)
      );
    }
    
    setFilteredOrders(result);
  }, [statusFilter, workstationFilter, orders]);

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const handlePrevPeriod = () => {
    if (viewMode === 'day') {
      setCurrentDate(prevDate => subDays(prevDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(prevDate => subWeeks(prevDate, 1));
    } else if (viewMode === 'month') {
      const prevMonth = new Date(currentDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setCurrentDate(prevMonth);
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === 'day') {
      setCurrentDate(prevDate => addDays(prevDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(prevDate => addWeeks(prevDate, 1));
    } else if (viewMode === 'month') {
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentDate(nextMonth);
    }
  };

  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleWorkstationFilterChange = (event) => {
    setWorkstationFilter(event.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRefresh = () => {
    setLoading(true);
    // In a real implementation, this would refetch the data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleViewDetails = () => {
    if (selectedOrder) {
      navigate(`/manufacturing/orders/${selectedOrder.id}`);
    }
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      navigate(`/manufacturing/orders/${selectedOrder.id}/edit`);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Planned':
        return 'info';
      case 'Not Started':
        return 'default';
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

  // Get days for the current view
  const getDaysForView = () => {
    if (viewMode === 'day') {
      return [currentDate];
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
      return eachDayOfInterval({ start, end });
    } else if (viewMode === 'month') {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return eachDayOfInterval({ start, end });
    }
    return [];
  };

  // Check if an order has operations on a specific day
  const hasOperationsOnDay = (order, day) => {
    return order.operations.some(op => {
      const startDate = new Date(op.startDate);
      const endDate = new Date(op.endDate);
      return isWithinInterval(day, { start: startDate, end: endDate }) ||
             isSameDay(day, startDate) ||
             isSameDay(day, endDate);
    });
  };

  // Get operations for a specific day
  const getOperationsForDay = (order, day) => {
    return order.operations.filter(op => {
      const startDate = new Date(op.startDate);
      const endDate = new Date(op.endDate);
      return isWithinInterval(day, { start: startDate, end: endDate }) ||
             isSameDay(day, startDate) ||
             isSameDay(day, endDate);
    });
  };

  // Render the timeline view
  const renderTimeline = () => {
    const days = getDaysForView();
    
    return (
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', minWidth: days.length * 150 }}>
          {/* Timeline header */}
          <Box sx={{ width: 200, flexShrink: 0, borderRight: '1px solid #e0e0e0', p: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Orders / Operations</Typography>
          </Box>
          
          {/* Days */}
          {days.map((day, index) => (
            <Box
              key={index}
              sx={{
                width: 150,
                flexShrink: 0,
                p: 1,
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                bgcolor: isSameDay(day, new Date()) ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
              }}
            >
              <Typography variant="subtitle2">{format(day, 'EEE')}</Typography>
              <Typography variant="caption">{format(day, 'MMM d, yyyy')}</Typography>
            </Box>
          ))}
        </Box>
        
        {/* Timeline rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: days.length * 150 }}>
          {filteredOrders.map(order => (
            <Box key={order.id} sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
              {/* Order info */}
              <Box
                sx={{
                  width: 200,
                  flexShrink: 0,
                  p: 1,
                  borderRight: '1px solid #e0e0e0',
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {order.orderNumber}
                </Typography>
                <Typography variant="caption" display="block">
                  {order.productName}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ mr: 0.5 }}
                  />
                  <Chip
                    label={order.priority}
                    color={getPriorityColor(order.priority)}
                    size="small"
                  />
                </Box>
              </Box>
              
              {/* Days */}
              {days.map((day, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 150,
                    flexShrink: 0,
                    p: 1,
                    borderRight: '1px solid #e0e0e0',
                    bgcolor: isSameDay(day, new Date()) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    cursor: hasOperationsOnDay(order, day) ? 'pointer' : 'default'
                  }}
                  onClick={hasOperationsOnDay(order, day) ? () => handleOrderClick(order) : undefined}
                >
                  {getOperationsForDay(order, day).map(op => (
                    <Box
                      key={op.id}
                      sx={{
                        p: 0.5,
                        mb: 0.5,
                        borderRadius: 1,
                        bgcolor:
                          op.status === 'Completed' ? 'success.light' :
                          op.status === 'In Progress' ? 'primary.light' :
                          'grey.200',
                        '&:hover': {
                          bgcolor:
                            op.status === 'Completed' ? 'success.main' :
                            op.status === 'In Progress' ? 'primary.main' :
                            'grey.300',
                        }
                      }}
                    >
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>
                        {op.name}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {format(new Date(op.startDate), 'MMM d')} - {format(new Date(op.endDate), 'MMM d')}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {workstations.find(w => w.id === op.workstationId)?.name || 'Unassigned'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            Production Schedule
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/manufacturing/orders/new')}
              sx={{ mr: 2 }}
            >
              New Order
            </Button>
            <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel>View</InputLabel>
              <Select
                value={viewMode}
                label="View"
                onChange={handleViewModeChange}
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={handlePrevPeriod}>
              <ArrowBackIcon />
            </IconButton>
            <DatePicker
              value={currentDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} size="small" sx={{ width: 150, mx: 1 }} />}
            />
            <IconButton onClick={handleNextPeriod}>
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Paper sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {viewMode === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
              {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`}
              {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
            </Typography>
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
                  <InputLabel>Workstation</InputLabel>
                  <Select
                    value={workstationFilter}
                    label="Workstation"
                    onChange={handleWorkstationFilterChange}
                  >
                    <MenuItem value="all">All Workstations</MenuItem>
                    {workstations.map(station => (
                      <MenuItem key={station.id} value={station.id}>
                        {station.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : filteredOrders.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">No manufacturing orders found for the selected filters.</Typography>
            </Box>
          ) : (
            renderTimeline()
          )}
        </Paper>
        
        {/* Order Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          {selectedOrder && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {selectedOrder.orderNumber} - {selectedOrder.productName}
                  </Typography>
                  <Box>
                    <Chip
                      label={selectedOrder.status}
                      color={getStatusColor(selectedOrder.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={selectedOrder.priority}
                      color={getPriorityColor(selectedOrder.priority)}
                      size="small"
                    />
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Order Details</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Quantity:</strong> {selectedOrder.completedQuantity} of {selectedOrder.quantity} completed
                      </Typography>
                      <Typography variant="body2">
                        <strong>Start Date:</strong> {selectedOrder.startDate}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Due Date:</strong> {selectedOrder.dueDate}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Assigned To:</strong> {selectedOrder.assignedTo}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Operations</Typography>
                    {selectedOrder.operations.map(op => (
                      <Box key={op.id} sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {op.name}
                          <Chip
                            label={op.status}
                            color={getStatusColor(op.status)}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                        <Typography variant="body2">
                          {format(new Date(op.startDate), 'MMM d, yyyy')} - {format(new Date(op.endDate), 'MMM d, yyyy')}
                        </Typography>
                        <Typography variant="body2">
                          {workstations.find(w => w.id === op.workstationId)?.name || 'Unassigned'}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
                <Button onClick={handleEditOrder} startIcon={<EditIcon />}>Edit</Button>
                <Button onClick={handleViewDetails} variant="contained">View Full Details</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}