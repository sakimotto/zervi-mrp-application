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
  Grid,
  LinearProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

export default function LaminatingOperationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState([]);
  const [filteredOperations, setFilteredOperations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Mock data for operations
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOperations = [
        {
          id: 1,
          operationId: 'LAM-2025001',
          manufacturingOrderId: 'MO-2025010',
          productName: 'Outdoor Banners - Weather Resistant',
          status: 'In Progress',
          priority: 'High',
          startTime: '2025-04-15T09:00:00',
          endTime: null,
          assignedOperator: 'Robert Chen',
          workstation: 'Mimaki LA-160W',
          completedQuantity: 18,
          totalQuantity: 50,
          laminationType: 'Hot Lamination'
        },
        {
          id: 2,
          operationId: 'LAM-2025002',
          manufacturingOrderId: 'MO-2025011',
          productName: 'Product Packaging - Food Grade',
          status: 'Planned',
          priority: 'Medium',
          startTime: '2025-04-18T08:00:00',
          endTime: null,
          assignedOperator: 'Maria Garcia',
          workstation: 'GMP Excelam Q1400',
          completedQuantity: 0,
          totalQuantity: 1000,
          laminationType: 'Cold Lamination'
        },
        {
          id: 3,
          operationId: 'LAM-2025003',
          manufacturingOrderId: 'MO-2025012',
          productName: 'Automotive Interior Panels',
          status: 'Completed',
          priority: 'High',
          startTime: '2025-04-10T07:30:00',
          endTime: '2025-04-11T16:45:00',
          assignedOperator: 'Thomas Müller',
          workstation: 'D&K System 2700',
          completedQuantity: 75,
          totalQuantity: 75,
          laminationType: 'Thermal Lamination'
        }
      ];
      
      setOperations(mockOperations);
      setFilteredOperations(mockOperations);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...operations];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(operation => operation.status === statusFilter);
    }
    
    // Apply date range filter
    if (startDate && endDate) {
      result = result.filter(operation => {
        const opStartDate = new Date(operation.startTime);
        return opStartDate >= startDate && opStartDate <= endDate;
      });
    } else if (startDate) {
      result = result.filter(operation => {
        const opStartDate = new Date(operation.startTime);
        return opStartDate >= startDate;
      });
    } else if (endDate) {
      result = result.filter(operation => {
        const opStartDate = new Date(operation.startTime);
        return opStartDate <= endDate;
      });
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      result = result.filter(
        operation =>
          operation.operationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          operation.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          operation.laminationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (operation.assignedOperator && operation.assignedOperator.toLowerCase().includes(searchTerm.toLowerCase())) ||
          operation.manufacturingOrderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOperations(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, startDate, endDate, operations]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return {
          bgcolor: '#e8f5e9',
          color: '#2e7d32',
          icon: <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
        };
      case 'In Progress':
        return {
          bgcolor: '#e3f2fd',
          color: '#1565c0',
          icon: <TimelineIcon fontSize="small" sx={{ mr: 0.5 }} />
        };
      case 'Planned':
        return {
          bgcolor: '#f3e5f5',
          color: '#6a1b9a',
          icon: <AssignmentIcon fontSize="small" sx={{ mr: 0.5 }} />
        };
      case 'On Hold':
        return {
          bgcolor: '#fff8e1',
          color: '#f57f17',
          icon: <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
        };
      case 'Cancelled':
        return {
          bgcolor: '#fafafa',
          color: '#757575',
          icon: <CloseIcon fontSize="small" sx={{ mr: 0.5 }} />
        };
      default:
        return {
          bgcolor: '#f5f5f5',
          color: '#616161',
          icon: null
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = (completed, total) => {
    if (!total || total === 0) return 0;
    return (completed / total) * 100;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Laminating Operations
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ mr: 1 }}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Operations"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                }}
                placeholder="Search by ID, product, material type..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Planned">Planned</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {showFilters && (
            <Grid container spacing={2} sx={{ mt: 1 }} alignItems="center">
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Operations Table */}
        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Operation ID</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Lamination Type</TableCell>
                    <TableCell>Operator</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Start Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOperations
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((operation) => {
                      const statusColor = getStatusColor(operation.status);
                      const progress = calculateProgress(
                        operation.completedQuantity,
                        operation.totalQuantity
                      );

                      return (
                        <TableRow key={operation.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {operation.operationId}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {operation.manufacturingOrderId}
                            </Typography>
                          </TableCell>
                          <TableCell>{operation.productName}</TableCell>
                          <TableCell>
                            <Chip
                              icon={statusColor.icon}
                              label={operation.status}
                              size="small"
                              sx={{
                                bgcolor: statusColor.bgcolor,
                                color: statusColor.color
                              }}
                            />
                          </TableCell>
                          <TableCell>{operation.laminationType}</TableCell>
                          <TableCell>{operation.assignedOperator || 'Unassigned'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={progress}
                                  sx={{ height: 8, borderRadius: 5 }}
                                />
                              </Box>
                              <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="textSecondary">
                                  {`${Math.round(progress)}%`}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                              {`${operation.completedQuantity} / ${operation.totalQuantity}`}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatDate(operation.startTime)}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredOperations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
}
