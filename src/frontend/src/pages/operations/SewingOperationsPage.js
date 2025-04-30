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
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  Badge,
  Rating
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  BugReport as BugReportIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { specializedOperationsAPI } from '../../services/api';

export default function SewingOperationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState([]);
  const [filteredOperations, setFilteredOperations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Selected operation for details panel
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Dialog states
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [qualityDialogOpen, setQualityDialogOpen] = useState(false);

  // Mock data for operators
  const operators = [
    { id: 1, name: 'Sarah Johnson', skillLevel: 'Expert', specialties: ['Overlock', 'Flatlock'] },
    { id: 2, name: 'Michael Chen', skillLevel: 'Intermediate', specialties: ['Straight Stitch', 'Zigzag'] },
    { id: 3, name: 'Emily Rodriguez', skillLevel: 'Expert', specialties: ['Decorative', 'Buttonhole'] },
    { id: 4, name: 'David Kim', skillLevel: 'Beginner', specialties: ['Straight Stitch'] },
    { id: 5, name: 'Lisa Patel', skillLevel: 'Advanced', specialties: ['Overlock', 'Coverstitch'] }
  ];

  // Mock data for operations
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOperations = [
        {
          id: 1,
          operationId: 'SEW-2025001',
          manufacturingOrderId: 'MO-2025001',
          productName: 'Camping Tent - 2-Person',
          status: 'In Progress',
          priority: 'High',
          startTime: '2025-04-15T09:00:00',
          endTime: null,
          assignedOperator: 'Sarah Johnson',
          workstation: 'Sewing Station 3',
          completedQuantity: 15,
          totalQuantity: 50,
          parameters: {
            stitch_type: 'straight',
            stitch_length_mm: 2.5,
            thread_type: 'Polyester #40',
            needle_size: '90/14',
            seam_type: 'Flat Felled Seam'
          },
          equipment_settings: {
            tension: 5,
            speed: 'medium',
            presser_foot_pressure: 'medium'
          },
          materialConsumption: [
            { material: 'Polyester Thread - Green', consumed: 120, unit: 'meters', allocated: 300 },
            { material: 'Nylon Thread - Beige', consumed: 80, unit: 'meters', allocated: 200 }
          ],
          qualityMetrics: {
            inspected: 15,
            passed: 13,
            defects: [
              { type: 'minor', count: 1, description: 'Loose thread' },
              { type: 'major', count: 1, description: 'Uneven seam' }
            ],
            firstPieceInspection: {
              completed: true,
              inspector: 'Quality Team A',
              result: 'Approved with minor adjustments',
              date: '2025-04-15T10:30:00'
            }
          },
          notes: 'Ensure double stitching on all stress points'
        },
        {
          id: 2,
          operationId: 'SEW-2025002',
          manufacturingOrderId: 'MO-2025002',
          productName: 'Hiking Backpack - 40L',
          status: 'Planned',
          priority: 'Medium',
          startTime: '2025-04-20T08:00:00',
          endTime: null,
          assignedOperator: 'Michael Chen',
          workstation: 'Sewing Station 1',
          completedQuantity: 0,
          totalQuantity: 100,
          parameters: {
            stitch_type: 'zigzag',
            stitch_length_mm: 3.0,
            thread_type: 'Heavy Duty Nylon',
            needle_size: '100/16',
            seam_type: 'Bound Seam'
          },
          equipment_settings: {
            tension: 6,
            speed: 'slow',
            presser_foot_pressure: 'high'
          },
          materialConsumption: [
            { material: 'Heavy Duty Nylon Thread - Black', consumed: 0, unit: 'meters', allocated: 500 }
          ],
          qualityMetrics: {
            inspected: 0,
            passed: 0,
            defects: [],
            firstPieceInspection: {
              completed: false,
              inspector: null,
              result: null,
              date: null
            }
          },
          notes: 'Reinforced stitching required on shoulder straps'
        },
        {
          id: 3,
          operationId: 'SEW-2025003',
          manufacturingOrderId: 'MO-2025003',
          productName: 'Waterproof Jacket - Large',
          status: 'In Progress',
          priority: 'Medium',
          startTime: '2025-04-10T10:00:00',
          endTime: null,
          assignedOperator: 'Emily Rodriguez',
          workstation: 'Sewing Station 5',
          completedQuantity: 40,
          totalQuantity: 75,
          parameters: {
            stitch_type: 'straight',
            stitch_length_mm: 2.0,
            thread_type: 'Waterproof Polyester',
            needle_size: '80/12',
            seam_type: 'Taped Seam'
          },
          equipment_settings: {
            tension: 4,
            speed: 'medium',
            presser_foot_pressure: 'medium'
          },
          materialConsumption: [
            { material: 'Waterproof Polyester Thread - Navy', consumed: 320, unit: 'meters', allocated: 600 },
            { material: 'Seam Tape - 10mm', consumed: 180, unit: 'meters', allocated: 350 }
          ],
          qualityMetrics: {
            inspected: 40,
            passed: 38,
            defects: [
              { type: 'minor', count: 1, description: 'Loose thread' },
              { type: 'minor', count: 1, description: 'Slight puckering' }
            ],
            firstPieceInspection: {
              completed: true,
              inspector: 'Quality Team B',
              result: 'Approved',
              date: '2025-04-10T11:15:00'
            }
          },
          notes: 'Ensure all seams are properly taped for waterproofing'
        },
        {
          id: 4,
          operationId: 'SEW-2025004',
          manufacturingOrderId: 'MO-2025004',
          productName: 'Sleeping Bag - Winter',
          status: 'Completed',
          priority: 'Low',
          startTime: '2025-04-05T09:00:00',
          endTime: '2025-04-15T16:30:00',
          assignedOperator: 'Lisa Patel',
          workstation: 'Sewing Station 2',
          completedQuantity: 30,
          totalQuantity: 30,
          parameters: {
            stitch_type: 'straight',
            stitch_length_mm: 3.5,
            thread_type: 'Heavy Duty Polyester',
            needle_size: '100/16',
            seam_type: 'Lapped Seam'
          },
          equipment_settings: {
            tension: 5,
            speed: 'medium',
            presser_foot_pressure: 'high'
          },
          materialConsumption: [
            { material: 'Heavy Duty Polyester Thread - Green', consumed: 240, unit: 'meters', allocated: 250 }
          ],
          qualityMetrics: {
            inspected: 30,
            passed: 30,
            defects: [],
            firstPieceInspection: {
              completed: true,
              inspector: 'Quality Team A',
              result: 'Approved',
              date: '2025-04-05T10:45:00'
            }
          },
          notes: 'Double check zipper alignment before final stitching'
        },
        {
          id: 5,
          operationId: 'SEW-2025005',
          manufacturingOrderId: 'MO-2025005',
          productName: 'Camping Chair',
          status: 'Planned',
          priority: 'High',
          startTime: '2025-04-25T08:00:00',
          endTime: null,
          assignedOperator: null,
          workstation: null,
          completedQuantity: 0,
          totalQuantity: 120,
          parameters: {
            stitch_type: 'straight',
            stitch_length_mm: 4.0,
            thread_type: 'Heavy Duty Nylon',
            needle_size: '110/18',
            seam_type: 'Flat Felled Seam'
          },
          equipment_settings: {
            tension: 7,
            speed: 'slow',
            presser_foot_pressure: 'high'
          },
          materialConsumption: [
            { material: 'Heavy Duty Nylon Thread - Black', consumed: 0, unit: 'meters', allocated: 800 }
          ],
          qualityMetrics: {
            inspected: 0,
            passed: 0,
            defects: [],
            firstPieceInspection: {
              completed: false,
              inspector: null,
              result: null,
              date: null
            }
          },
          notes: 'Use reinforced stitching on all weight-bearing seams'
        }
      ];
      
      setOperations(mockOperations);
      setFilteredOperations(mockOperations);
      setLoading(false);
    }, 1000);

    // In real implementation, would use:
    // const fetchOperations = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await specializedOperationsAPI.getAllSewingOperations();
    //     setOperations(response.data);
    //     setFilteredOperations(response.data);
    //   } catch (error) {
    //     console.error('Error fetching sewing operations:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchOperations();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...operations];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(operation => operation.status === statusFilter);
    }
    
    // Apply operator filter
    if (operatorFilter !== 'all') {
      result = result.filter(operation => 
        operation.assignedOperator && operation.assignedOperator === operatorFilter
      );
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
          (operation.assignedOperator && operation.assignedOperator.toLowerCase().includes(searchTerm.toLowerCase())) ||
          operation.manufacturingOrderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOperations(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, operatorFilter, startDate, endDate, operations]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleOperatorFilterChange = (event) => {
    setOperatorFilter(event.target.value);
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
    
    // In real implementation:
    // fetchOperations();
  };

  const handleViewOperation = (operation) => {
    setSelectedOperation(operation);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOperation(null);
    setActiveTab(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAssignOperator = (operationId) => {
    setSelectedOperation(operations.find(op => op.id === operationId));
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
  };

  const handleSaveAssignment = () => {
    // In real implementation, would save the assignment
    setAssignDialogOpen(false);
    // Refresh operations
    handleRefresh();
  };

  const handleQualityCheck = (operationId) => {
    setSelectedOperation(operations.find(op => op.id === operationId));
    setQualityDialogOpen(true);
  };

  const handleCloseQualityDialog = () => {
    setQualityDialogOpen(false);
  };

  const handleSaveQualityCheck = () => {
    // In real implementation, would save the quality check
    setQualityDialogOpen(false);
    // Refresh operations
    handleRefresh();
  };

  const handleNavigateToOrder = (manufacturingOrderId) => {
    navigate(`/manufacturing/orders/${manufacturingOrderId.split('-')[1]}`);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get defect severity color
  const getDefectSeverityColor = (type) => {
    switch (type) {
      case 'critical':
        return 'error';
      case 'major':
        return 'warning';
      case 'minor':
        return 'info';
      default:
        return 'default';
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Sewing Operations
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => console.log('Create new sewing operation')}
        >
          Create New Operation
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search Operations"
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
                <InputLabel>Operator</InputLabel>
                <Select
                  value={operatorFilter}
                  label="Operator"
                  onChange={handleOperatorFilterChange}
                >
                  <MenuItem value="all">All Operators</MenuItem>
                  <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
                  <MenuItem value="Michael Chen">Michael Chen</MenuItem>
                  <MenuItem value="Emily Rodriguez">Emily Rodriguez</MenuItem>
                  <MenuItem value="David Kim">David Kim</MenuItem>
                  <MenuItem value="Lisa Patel">Lisa Patel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Operation ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>MO Reference</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Operator</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOperations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((operation) => (
                  <TableRow key={operation.id} hover onClick={() => handleViewOperation(operation)} sx={{ cursor: 'pointer' }}>
                    <TableCell>{operation.operationId}</TableCell>
                    <TableCell>{operation.productName}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="text" 
                        endIcon={<ArrowForwardIcon fontSize="small" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToOrder(operation.manufacturingOrderId);
                        }}
                      >
                        {operation.manufacturingOrderId}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={operation.status} 
                        color={getStatusColor(operation.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={operation.priority} 
                        color={getPriorityColor(operation.priority)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={calculateProgress(operation.completedQuantity, operation.totalQuantity)} 
                            sx={{ height: 8, borderRadius: 5 }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {Math.round(calculateProgress(operation.completedQuantity, operation.totalQuantity))}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption">
                        {operation.completedQuantity} of {operation.totalQuantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {operation.assignedOperator ? (
                        operation.assignedOperator
                      ) : (
                        <Chip 
                          label="Unassigned" 
                          variant="outlined" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(operation.startTime)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOperation(operation);
                            }}
                          >
                            <AssignmentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Assign Operator">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignOperator(operation.id);
                            }}
                          >
                            <PersonIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Quality Check">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQualityCheck(operation.id);
                            }}
                          >
                            <BugReportIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOperations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Operation Details Drawer */}
      <Drawer
        anchor="right"
        open={detailsOpen}
        onClose={handleCloseDetails}
        sx={{
          width: 600,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 600,
            boxSizing: 'border-box',
            padding: 2
          },
        }}
      >
        {selectedOperation && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Operation Details: {selectedOperation.operationId}
              </Typography>
              <IconButton onClick={handleCloseDetails}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedOperation.productName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip 
                  label={selectedOperation.status} 
                  color={getStatusColor(selectedOperation.status)} 
                  size="small" 
                />
                <Chip 
                  label={selectedOperation.priority} 
                  color={getPriorityColor(selectedOperation.priority)} 
                  size="small" 
                />
                <Chip 
                  label={`MO: ${selectedOperation.manufacturingOrderId}`} 
                  variant="outlined"
                  size="small" 
                  onClick={() => handleNavigateToOrder(selectedOperation.manufacturingOrderId)}
                />
              </Box>
              <Typography variant="body2">
                <strong>Start Date:</strong> {formatDate(selectedOperation.startTime)}
              </Typography>
              {selectedOperation.endTime && (
                <Typography variant="body2">
                  <strong>End Date:</strong> {formatDate(selectedOperation.endTime)}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Workstation:</strong> {selectedOperation.workstation || 'Not assigned'}
              </Typography>
              <Typography variant="body2">
                <strong>Operator:</strong> {selectedOperation.assignedOperator || 'Not assigned'}
              </Typography>
              <Typography variant="body2">
                <strong>Progress:</strong> {selectedOperation.completedQuantity} of {selectedOperation.totalQuantity} ({Math.round(calculateProgress(selectedOperation.completedQuantity, selectedOperation.totalQuantity))}%)
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={calculateProgress(selectedOperation.completedQuantity, selectedOperation.totalQuantity)} 
                sx={{ height: 8, borderRadius: 5, mt: 1 }}
              />
            </Box>
            
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab icon={<SettingsIcon />} label="Machine Settings" />
              <Tab icon={<TimelineIcon />} label="Material Consumption" />
              <Tab icon={<BugReportIcon />} label="Quality Control" />
            </Tabs>
            
            {/* Machine Settings Tab */}
            {activeTab === 0 && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader title="Machine Settings & Parameters" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Stitch Parameters</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Stitch Type" 
                            secondary={selectedOperation.parameters.stitch_type} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Stitch Length (mm)" 
                            secondary={selectedOperation.parameters.stitch_length_mm} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Thread Type" 
                            secondary={selectedOperation.parameters.thread_type} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Needle Size" 
                            secondary={selectedOperation.parameters.needle_size} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Seam Type" 
                            secondary={selectedOperation.parameters.seam_type} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Equipment Settings</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Tension" 
                            secondary={selectedOperation.equipment_settings.tension} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Speed" 
                            secondary={selectedOperation.equipment_settings.speed} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Presser Foot Pressure" 
                            secondary={selectedOperation.equipment_settings.presser_foot_pressure} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                  {selectedOperation.notes && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Notes</Typography>
                      <Typography variant="body2">{selectedOperation.notes}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Material Consumption Tab */}
            {activeTab === 1 && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader title="Material Consumption Tracking" />
                <CardContent>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Material</TableCell>
                          <TableCell align="right">Consumed</TableCell>
                          <TableCell align="right">Allocated</TableCell>
                          <TableCell align="right">Remaining</TableCell>
                          <TableCell align="right">Usage %</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOperation.materialConsumption.map((material, index) => (
                          <TableRow key={index}>
                            <TableCell>{material.material}</TableCell>
                            <TableCell align="right">{material.consumed} {material.unit}</TableCell>
                            <TableCell align="right">{material.allocated} {material.unit}</TableCell>
                            <TableCell align="right">{material.allocated - material.consumed} {material.unit}</TableCell>
                            <TableCell align="right">
                              {Math.round((material.consumed / material.allocated) * 100)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
            
            {/* Quality Control Tab */}
            {activeTab === 2 && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader 
                  title="Quality Control" 
                  subheader={`Inspected: ${selectedOperation.qualityMetrics.inspected} | Passed: ${selectedOperation.qualityMetrics.passed}`}
                />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>First Piece Inspection</Typography>
                    {selectedOperation.qualityMetrics.firstPieceInspection.completed ? (
                      <>
                        <Typography variant="body2">
                          <strong>Inspector:</strong> {selectedOperation.qualityMetrics.firstPieceInspection.inspector}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Result:</strong> {selectedOperation.qualityMetrics.firstPieceInspection.result}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {formatDate(selectedOperation.qualityMetrics.firstPieceInspection.date)}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        First piece inspection not completed yet
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>Defects</Typography>
                  {selectedOperation.qualityMetrics.defects.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Count</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOperation.qualityMetrics.defects.map((defect, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Chip 
                                  label={defect.type} 
                                  color={getDefectSeverityColor(defect.type)} 
                                  size="small" 
                                />
                              </TableCell>
                              <TableCell>{defect.description}</TableCell>
                              <TableCell align="right">{defect.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No defects reported
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Drawer>
      
      {/* Assign Operator Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assign Operator
          {selectedOperation && (
            <Typography variant="subtitle2" color="text.secondary">
              {selectedOperation.operationId} - {selectedOperation.productName}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>Select Operator</Typography>
          <List>
            {operators.map((operator) => (
              <ListItem 
                key={operator.id}
                button 
                onClick={() => console.log(`Selected operator: ${operator.name}`)}
                secondaryAction={
                  <Chip 
                    label={operator.skillLevel} 
                    color={
                      operator.skillLevel === 'Expert' ? 'success' :
                      operator.skillLevel === 'Advanced' ? 'primary' :
                      operator.skillLevel === 'Intermediate' ? 'info' : 'default'
                    }
                    size="small"
                  />
                }
              >
                <ListItemText 
                  primary={operator.name} 
                  secondary={`Specialties: ${operator.specialties.join(', ')}`} 
                />
              </ListItem>
            ))}
          </List>
          
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Workstation Assignment</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Workstation</InputLabel>
            <Select
              value=""
              label="Workstation"
              onChange={() => {}}
            >
              <MenuItem value="Sewing Station 1">Sewing Station 1</MenuItem>
              <MenuItem value="Sewing Station 2">Sewing Station 2</MenuItem>
              <MenuItem value="Sewing Station 3">Sewing Station 3</MenuItem>
              <MenuItem value="Sewing Station 4">Sewing Station 4</MenuItem>
              <MenuItem value="Sewing Station 5">Sewing Station 5</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" gutterBottom>Schedule</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={new Date()}
                  onChange={() => {}}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estimated Duration (hours)"
                type="number"
                fullWidth
                defaultValue={8}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button onClick={handleSaveAssignment} variant="contained" color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Quality Check Dialog */}
      <Dialog open={qualityDialogOpen} onClose={handleCloseQualityDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Quality Check
          {selectedOperation && (
            <Typography variant="subtitle2" color="text.secondary">
              {selectedOperation.operationId} - {selectedOperation.productName}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>Inspection Details</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity Inspected"
                type="number"
                fullWidth
                defaultValue={1}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity Passed"
                type="number"
                fullWidth
                defaultValue={1}
              />
            </Grid>
          </Grid>
          
          <Typography variant="subtitle2" gutterBottom>Defect Reporting</Typography>
          <Box sx={{ mb: 3 }}>
            <FormGroup>
              <FormControlLabel 
                control={<Checkbox />} 
                label="Minor Defects" 
              />
              <TextField
                label="Description"
                fullWidth
                placeholder="Describe minor defects"
                sx={{ ml: 3, mt: 1 }}
              />
              <TextField
                label="Count"
                type="number"
                sx={{ ml: 3, mt: 1, width: 100 }}
                defaultValue={0}
              />
            </FormGroup>
            
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel 
                control={<Checkbox />} 
                label="Major Defects" 
              />
              <TextField
                label="Description"
                fullWidth
                placeholder="Describe major defects"
                sx={{ ml: 3, mt: 1 }}
              />
              <TextField
                label="Count"
                type="number"
                sx={{ ml: 3, mt: 1, width: 100 }}
                defaultValue={0}
              />
            </FormGroup>
            
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel 
                control={<Checkbox />} 
                label="Critical Defects" 
              />
              <TextField
                label="Description"
                fullWidth
                placeholder="Describe critical defects"
                sx={{ ml: 3, mt: 1 }}
              />
              <TextField
                label="Count"
                type="number"
                sx={{ ml: 3, mt: 1, width: 100 }}
                defaultValue={0}
              />
            </FormGroup>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>First Piece Inspection</Typography>
          <FormControlLabel 
            control={<Checkbox />} 
            label="This is a first piece inspection" 
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Inspection Result</InputLabel>
            <Select
              value="approved"
              label="Inspection Result"
              onChange={() => {}}
            >
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="approved_with_changes">Approved with Changes</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Notes"
            multiline
            rows={3}
            fullWidth
            placeholder="Additional notes about the quality check"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQualityDialog}>Cancel</Button>
          <Button onClick={handleSaveQualityCheck} variant="contained" color="primary">
            Save Quality Check
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
