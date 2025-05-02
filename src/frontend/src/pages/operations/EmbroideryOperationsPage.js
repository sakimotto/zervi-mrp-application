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
  Rating,
  Slider,
  Stack
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
  ArrowForward as ArrowForwardIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ColorLens as ColorLensIcon,
  FormatColorFill as FormatColorFillIcon,
  Palette as PaletteIcon,
  SettingsEthernet as SettingsEthernetIcon,
  Straighten as StraightenIcon,
  Tune as TuneIcon,
  Layers as LayersIcon,
  Image as ImageIcon,
  BrokenImage as BrokenIcon,
  Adjust as AdjustIcon,
  Colorize as ColorizeIcon
} from '@mui/icons-material';
import { specializedOperationsAPI } from '../../services/api';

export default function EmbroideryOperationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState([]);
  const [filteredOperations, setFilteredOperations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [designFilter, setDesignFilter] = useState('all');
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
  const [machineDialogOpen, setMachineDialogOpen] = useState(false);
  const [designDialogOpen, setDesignDialogOpen] = useState(false);
  
  // Design preview state
  const [zoomLevel, setZoomLevel] = useState(100);

  // Mock data for operators
  const operators = [
    { id: 1, name: 'Jennifer Wu', skillLevel: 'Expert', specialties: ['Multi-head Embroidery', 'Digitizing'] },
    { id: 2, name: 'Carlos Mendez', skillLevel: 'Intermediate', specialties: ['Single-head Embroidery', 'Appliqué'] },
    { id: 3, name: 'Priya Sharma', skillLevel: 'Expert', specialties: ['3D Embroidery', 'Sequin Embroidery'] },
    { id: 4, name: 'Alex Johnson', skillLevel: 'Beginner', specialties: ['Basic Embroidery'] },
    { id: 5, name: 'Fatima Al-Farsi', skillLevel: 'Advanced', specialties: ['Multi-head Embroidery', 'Chenille Embroidery'] }
  ];

  // Mock data for embroidery machines
  const embroideryMachines = [
    { id: 1, name: 'Tajima TFMX-C1506', type: 'Multi-head', heads: 6, needles: 15, status: 'Operational', lastMaintenance: '2025-04-05', nextMaintenance: '2025-05-05' },
    { id: 2, name: 'Barudan BEVT-Z1506C', type: 'Multi-head', heads: 6, needles: 15, status: 'Operational', lastMaintenance: '2025-03-20', nextMaintenance: '2025-05-20' },
    { id: 3, name: 'Brother PR1055X', type: 'Single-head', heads: 1, needles: 10, status: 'Maintenance Required', lastMaintenance: '2025-01-15', nextMaintenance: '2025-04-15' },
    { id: 4, name: 'ZSK JCZA 0109-550', type: 'Specialty', heads: 1, needles: 9, status: 'Operational', lastMaintenance: '2025-04-10', nextMaintenance: '2025-06-10' },
    { id: 5, name: 'Melco EMT16X', type: 'Single-head', heads: 1, needles: 16, status: 'Operational', lastMaintenance: '2025-03-30', nextMaintenance: '2025-05-30' }
  ];

  // Mock data for thread types
  const threadTypes = [
    'Rayon 40wt',
    'Polyester 40wt',
    'Metallic',
    'Cotton 30wt',
    'Silk',
    'Glow-in-the-dark',
    'Variegated',
    'Monofilament'
  ];

  // Mock data for design types
  const designTypes = [
    'Logo',
    'Text',
    'Decorative Pattern',
    'Appliqué',
    'Monogram',
    'Photorealistic',
    '3D Puff',
    'Sequin'
  ];

  // Mock data for operations
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOperations = [
        {
          id: 1,
          operationId: 'EMB-2025001',
          manufacturingOrderId: 'MO-2025006',
          productName: 'Corporate Polo Shirts - Logo',
          status: 'In Progress',
          priority: 'High',
          startTime: '2025-04-14T08:00:00',
          endTime: null,
          assignedOperator: 'Jennifer Wu',
          workstation: 'Tajima TFMX-C1506',
          completedQuantity: 35,
          totalQuantity: 100,
          designName: 'Zervitek Corporate Logo',
          designType: 'Logo',
          parameters: {
            design_file: 'zervitek_logo_v2.dst',
            stitch_count: 8500,
            dimensions: '10cm x 8cm',
            colors_count: 5,
            underlay: true,
            backing_type: 'Cutaway Stabilizer'
          },
          machine_settings: {
            speed: 750, // stitches per minute
            tension: 'Medium',
            hoop_size: '12cm x 12cm',
            needle_sequence: [1, 2, 3, 4, 5]
          },
          threadConsumption: [
            { color: 'Navy Blue', thread_type: 'Polyester 40wt', consumed: 120, unit: 'meters', allocated: 300 },
            { color: 'White', thread_type: 'Polyester 40wt', consumed: 85, unit: 'meters', allocated: 200 },
            { color: 'Silver', thread_type: 'Metallic', consumed: 40, unit: 'meters', allocated: 100 },
            { color: 'Light Blue', thread_type: 'Polyester 40wt', consumed: 65, unit: 'meters', allocated: 150 },
            { color: 'Gray', thread_type: 'Polyester 40wt', consumed: 50, unit: 'meters', allocated: 120 }
          ],
          colorPalette: [
            { position: 1, color: '#0A2463', name: 'Navy Blue', thread_code: 'PE-1545' },
            { position: 2, color: '#FFFFFF', name: 'White', thread_code: 'PE-1001' },
            { position: 3, color: '#C0C0C0', name: 'Silver', thread_code: 'MT-2001' },
            { position: 4, color: '#7D9CC0', name: 'Light Blue', thread_code: 'PE-1356' },
            { position: 5, color: '#808080', name: 'Gray', thread_code: 'PE-1201' }
          ],
          designDetails: {
            stitch_types: ['Satin', 'Fill', 'Running'],
            stitch_density: 'Medium',
            special_effects: ['3D Foam'],
            design_format: 'DST',
            digitized_by: 'Internal Design Team',
            digitizing_date: '2025-03-01',
            design_version: 2.0,
            preview_image: 'zervitek_logo_preview.png'
          },
          qualityMetrics: {
            inspected: 35,
            passed: 32,
            defects: [
              { type: 'minor', count: 2, description: 'Thread break during production' },
              { type: 'minor', count: 1, description: 'Slight color misalignment' }
            ],
            thread_breaks: 5,
            alignment_score: 4.5, // out of 5
            color_matching_score: 4.8, // out of 5
            firstPieceInspection: {
              completed: true,
              inspector: 'Quality Team A',
              result: 'Approved with minor adjustments',
              date: '2025-04-14T09:30:00'
            }
          },
          machinePerformance: {
            average_speed: 720, // stitches per minute
            downtime: 45, // minutes
            efficiency: 92, // percentage
            maintenance_notes: 'Thread tension adjusted during production'
          },
          downstreamOperations: [
            { id: 'PKG-2025006', type: 'Packaging', status: 'Planned' },
            { id: 'QC-2025006', type: 'Quality Control', status: 'Planned' }
          ],
          upstreamOperations: [
            { id: 'CUT-2025006', type: 'Cutting', status: 'Completed' }
          ],
          notes: 'Ensure proper backing is used for stability'
        },
        {
          id: 2,
          operationId: 'EMB-2025002',
          manufacturingOrderId: 'MO-2025007',
          productName: 'Custom Baseball Caps',
          status: 'Planned',
          priority: 'Medium',
          startTime: '2025-04-18T08:00:00',
          endTime: null,
          assignedOperator: 'Carlos Mendez',
          workstation: 'Barudan BEVT-Z1506C',
          completedQuantity: 0,
          totalQuantity: 50,
          designName: 'Mountain Adventure Logo',
          designType: 'Logo',
          parameters: {
            design_file: 'mountain_adventure_v1.dst',
            stitch_count: 6200,
            dimensions: '6cm x 5cm',
            colors_count: 4,
            underlay: true,
            backing_type: 'Tearaway Stabilizer'
          },
          machine_settings: {
            speed: 800, // stitches per minute
            tension: 'Medium-High',
            hoop_size: '9cm x 9cm',
            needle_sequence: [1, 3, 5, 7]
          },
          threadConsumption: [
            { color: 'Forest Green', thread_type: 'Polyester 40wt', consumed: 0, unit: 'meters', allocated: 150 },
            { color: 'Brown', thread_type: 'Polyester 40wt', consumed: 0, unit: 'meters', allocated: 120 },
            { color: 'Beige', thread_type: 'Polyester 40wt', consumed: 0, unit: 'meters', allocated: 100 },
            { color: 'White', thread_type: 'Polyester 40wt', consumed: 0, unit: 'meters', allocated: 80 }
          ],
          colorPalette: [
            { position: 1, color: '#2C5F2D', name: 'Forest Green', thread_code: 'PE-1622' },
            { position: 3, color: '#5E3023', name: 'Brown', thread_code: 'PE-1732' },
            { position: 5, color: '#F5F5DC', name: 'Beige', thread_code: 'PE-1052' },
            { position: 7, color: '#FFFFFF', name: 'White', thread_code: 'PE-1001' }
          ],
          designDetails: {
            stitch_types: ['Satin', 'Fill', 'Running'],
            stitch_density: 'Medium',
            special_effects: [],
            design_format: 'DST',
            digitized_by: 'External Vendor',
            digitizing_date: '2025-03-15',
            design_version: 1.0,
            preview_image: 'mountain_adventure_preview.png'
          },
          qualityMetrics: {
            inspected: 0,
            passed: 0,
            defects: [],
            thread_breaks: 0,
            alignment_score: null,
            color_matching_score: null,
            firstPieceInspection: {
              completed: false,
              inspector: null,
              result: null,
              date: null
            }
          },
          machinePerformance: {
            average_speed: null,
            downtime: null,
            efficiency: null,
            maintenance_notes: 'Machine scheduled for pre-run check'
          },
          downstreamOperations: [
            { id: 'PKG-2025007', type: 'Packaging', status: 'Planned' },
            { id: 'QC-2025007', type: 'Quality Control', status: 'Planned' }
          ],
          upstreamOperations: [
            { id: 'PREP-2025007', type: 'Material Preparation', status: 'In Progress' }
          ],
          notes: 'Cap hooping requires special attention'
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
    //     const response = await specializedOperationsAPI.getAllEmbroideryOperations();
    //     setOperations(response.data);
    //     setFilteredOperations(response.data);
    //   } catch (error) {
    //     console.error('Error fetching embroidery operations:', error);
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
    
    // Apply design filter
    if (designFilter !== 'all') {
      result = result.filter(operation =>
        operation.designType === designFilter
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
          operation.designName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (operation.assignedOperator && operation.assignedOperator.toLowerCase().includes(searchTerm.toLowerCase())) ||
          operation.manufacturingOrderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOperations(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, operatorFilter, designFilter, startDate, endDate, operations]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleOperatorFilterChange = (event) => {
    setOperatorFilter(event.target.value);
  };

  const handleDesignFilterChange = (event) => {
    setDesignFilter(event.target.value);
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

  const handleMachineProgramming = (operationId) => {
    setSelectedOperation(operations.find(op => op.id === operationId));
    setMachineDialogOpen(true);
  };

  const handleCloseMachineDialog = () => {
    setMachineDialogOpen(false);
  };

  const handleSaveMachineSettings = () => {
    // In real implementation, would save the machine settings
    setMachineDialogOpen(false);
    // Refresh operations
    handleRefresh();
  };

  const handleDesignPreview = (operationId) => {
    setSelectedOperation(operations.find(op => op.id === operationId));
    setDesignDialogOpen(true);
  };

  const handleCloseDesignDialog = () => {
    setDesignDialogOpen(false);
    setZoomLevel(100); // Reset zoom level
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
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

  // Get priority color based on priority value
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Format date for display
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

  // Get color for thread break count
  const getThreadBreakColor = (count) => {
    if (count === 0) return 'success';
    if (count <= 3) return 'info';
    if (count <= 7) return 'warning';
    return 'error';
  };

  // Get color for alignment score
  const getAlignmentScoreColor = (score) => {
    if (!score) return 'default';
    if (score >= 4.5) return 'success';
    if (score >= 3.5) return 'info';
    if (score >= 2.5) return 'warning';
    return 'error';
  };

  // Get color for color matching score
  const getColorMatchingScoreColor = (score) => {
    if (!score) return 'default';
    if (score >= 4.5) return 'success';
    if (score >= 3.5) return 'info';
    if (score >= 2.5) return 'warning';
    return 'error';
  };

  // Calculate progress percentage
  const calculateProgress = (completed, total) => {
    if (!total) return 0;
    return (completed / total) * 100;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Embroidery Operations
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={showFilters ? <CloseIcon /> : <FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
            placeholder="Search by ID, design name, product..."
            sx={{ mb: 2 }}
          />

          {showFilters && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
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
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={operatorFilter}
                    onChange={handleOperatorFilterChange}
                    label="Operator"
                  >
                    <MenuItem value="all">All Operators</MenuItem>
                    {operators.map(operator => (
                      <MenuItem key={operator.id} value={operator.name}>{operator.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Design Type</InputLabel>
                  <Select
                    value={designFilter}
                    onChange={handleDesignFilterChange}
                    label="Design Type"
                  >
                    <MenuItem value="all">All Design Types</MenuItem>
                    {designTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
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
                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Operations Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Operation ID</TableCell>
                <TableCell>Design</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Operator</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={24} sx={{ my: 2 }} />
                    <Typography variant="body2" color="textSecondary">
                      Loading operations...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredOperations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No operations found matching the current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOperations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((operation) => (
                    <TableRow
                      key={operation.id}
                      hover
                      onClick={() => handleViewOperation(operation)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{operation.operationId}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              mr: 1,
                              bgcolor: 'primary.light',
                              fontSize: '0.75rem'
                            }}
                          >
                            <ImageIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                              {operation.designName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {operation.designType}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`Order: ${operation.manufacturingOrderId}`}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {operation.productName}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={operation.status}
                          size="small"
                          color={getStatusColor(operation.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={calculateProgress(operation.completedQuantity, operation.totalQuantity)}
                              sx={{ height: 8, borderRadius: 5 }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="textSecondary">
                              {operation.completedQuantity}/{operation.totalQuantity}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {operation.assignedOperator ? (
                          <Chip
                            icon={<PersonIcon />}
                            label={operation.assignedOperator}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            label="Unassigned"
                            size="small"
                            variant="outlined"
                            color="warning"
                          />
                        )}
                      </TableCell>
                      <TableCell>{formatDate(operation.startTime)}</TableCell>
                      <TableCell>
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
                        <Tooltip title="Design Preview">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDesignPreview(operation.id);
                            }}
                          >
                            <ImageIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
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

      {/* Details Drawer */}
      <Drawer
        anchor="right"
        open={detailsOpen}
        onClose={handleCloseDetails}
        sx={{
          width: 500,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 500,
            boxSizing: 'border-box',
            padding: 2
          },
        }}
      >
        {selectedOperation && (
          <Box sx={{ p: 2 }}>
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
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigateToOrder(selectedOperation.manufacturingOrderId)}
                sx={{ mb: 1 }}
              >
                Go to {selectedOperation.manufacturingOrderId}
              </Button>
              
              <Typography variant="h6" gutterBottom>
                {selectedOperation.productName}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Status</Typography>
                  <Chip
                    label={selectedOperation.status}
                    size="small"
                    color={getStatusColor(selectedOperation.status)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Priority</Typography>
                  <Chip
                    label={selectedOperation.priority}
                    size="small"
                    color={getPriorityColor(selectedOperation.priority)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Start Date</Typography>
                  <Typography variant="body2">{formatDate(selectedOperation.startTime)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">End Date</Typography>
                  <Typography variant="body2">{formatDate(selectedOperation.endTime)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Assigned Operator</Typography>
                  <Typography variant="body2">{selectedOperation.assignedOperator || 'Unassigned'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Workstation</Typography>
                  <Typography variant="body2">{selectedOperation.workstation || 'Unassigned'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Progress</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(selectedOperation.completedQuantity, selectedOperation.totalQuantity)}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="textSecondary">
                        {selectedOperation.completedQuantity}/{selectedOperation.totalQuantity}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Design Details" />
              <Tab label="Thread Consumption" />
              <Tab label="Machine Settings" />
              <Tab label="Quality Control" />
              <Tab label="Related Operations" />
            </Tabs>
            
            <Divider sx={{ mb: 2 }} />
            
            {/* Design Details Tab */}
            {activeTab === 0 && (
              <Box>
                <Card sx={{ mb: 2 }}>
                  <CardHeader
                    title="Design Information"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<ImageIcon color="primary" />}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Design Name</Typography>
                        <Typography variant="body2">{selectedOperation.designName}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Design Type</Typography>
                        <Typography variant="body2">{selectedOperation.designType}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Design File</Typography>
                        <Typography variant="body2">{selectedOperation.parameters.design_file}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Stitch Count</Typography>
                        <Typography variant="body2">{selectedOperation.parameters.stitch_count.toLocaleString()} stitches</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Dimensions</Typography>
                        <Typography variant="body2">{selectedOperation.parameters.dimensions}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Colors Count</Typography>
                        <Typography variant="body2">{selectedOperation.parameters.colors_count}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Underlay</Typography>
                        <Typography variant="body2">{selectedOperation.parameters.underlay ? 'Yes' : 'No'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Backing Type</Typography>
                        <Typography variant="body2">{selectedOperation.parameters.backing_type}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card sx={{ mb: 2 }}>
                  <CardHeader
                    title="Design Details"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<PaletteIcon color="primary" />}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Stitch Types</Typography>
                        <Typography variant="body2">{selectedOperation.designDetails.stitch_types.join(', ')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Stitch Density</Typography>
                        <Typography variant="body2">{selectedOperation.designDetails.stitch_density}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Special Effects</Typography>
                        <Typography variant="body2">
                          {selectedOperation.designDetails.special_effects.length > 0
                            ? selectedOperation.designDetails.special_effects.join(', ')
                            : 'None'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Design Format</Typography>
                        <Typography variant="body2">{selectedOperation.designDetails.design_format}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Digitized By</Typography>
                        <Typography variant="body2">{selectedOperation.designDetails.digitized_by}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Digitizing Date</Typography>
                        <Typography variant="body2">{new Date(selectedOperation.designDetails.digitizing_date).toLocaleDateString()}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Design Version</Typography>
                        <Typography variant="body2">{selectedOperation.designDetails.design_version}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader
                    title="Color Palette"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<ColorLensIcon color="primary" />}
                  />
                  <CardContent>
                    <Grid container spacing={1}>
                      {selectedOperation.colorPalette.map((color, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: color.color,
                                border: '1px solid rgba(0,0,0,0.1)',
                                mr: 1
                              }}
                            />
                            <Box>
                              <Typography variant="body2">{color.name}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                Position: {color.position} | Code: {color.thread_code}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
            
            {/* Thread Consumption Tab */}
            {activeTab === 1 && (
              <Box>
                <Card>
                  <CardHeader
                    title="Thread Consumption"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<LayersIcon color="primary" />}
                  />
                  <CardContent>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Color</TableCell>
                            <TableCell>Thread Type</TableCell>
                            <TableCell>Consumed</TableCell>
                            <TableCell>Allocated</TableCell>
                            <TableCell>Usage %</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOperation.threadConsumption.map((thread, index) => (
                            <TableRow key={index}>
                              <TableCell>{thread.color}</TableCell>
                              <TableCell>{thread.thread_type}</TableCell>
                              <TableCell>{thread.consumed} {thread.unit}</TableCell>
                              <TableCell>{thread.allocated} {thread.unit}</TableCell>
                              <TableCell>
                                {thread.allocated > 0 ?
                                  `${Math.round((thread.consumed / thread.allocated) * 100)}%` :
                                  'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            )}
            
            {/* Machine Settings Tab */}
            {activeTab === 2 && (
              <Box>
                <Card sx={{ mb: 2 }}>
                  <CardHeader
                    title="Machine Settings"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<SettingsIcon color="primary" />}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Speed</Typography>
                        <Typography variant="body2">
                          {selectedOperation.machine_settings.speed ?
                            `${selectedOperation.machine_settings.speed} stitches/min` :
                            'Not set'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Tension</Typography>
                        <Typography variant="body2">{selectedOperation.machine_settings.tension || 'Not set'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Hoop Size</Typography>
                        <Typography variant="body2">{selectedOperation.machine_settings.hoop_size}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Needle Sequence</Typography>
                        <Typography variant="body2">
                          {selectedOperation.machine_settings.needle_sequence ?
                            selectedOperation.machine_settings.needle_sequence.join(', ') :
                            'Not set'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                {selectedOperation.machinePerformance && (
                  <Card>
                    <CardHeader
                      title="Machine Performance"
                      titleTypographyProps={{ variant: 'subtitle1' }}
                      avatar={<SpeedIcon color="primary" />}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Average Speed</Typography>
                          <Typography variant="body2">
                            {selectedOperation.machinePerformance.average_speed ?
                              `${selectedOperation.machinePerformance.average_speed} stitches/min` :
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Downtime</Typography>
                          <Typography variant="body2">
                            {selectedOperation.machinePerformance.downtime !== null ?
                              `${selectedOperation.machinePerformance.downtime} minutes` :
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Efficiency</Typography>
                          <Typography variant="body2">
                            {selectedOperation.machinePerformance.efficiency !== null ?
                              `${selectedOperation.machinePerformance.efficiency}%` :
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Maintenance Notes</Typography>
                          <Typography variant="body2">
                            {selectedOperation.machinePerformance.maintenance_notes || 'No notes'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
            
            {/* Quality Control Tab */}
            {activeTab === 3 && (
              <Box>
                <Card sx={{ mb: 2 }}>
                  <CardHeader
                    title="Quality Metrics"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<BugReportIcon color="primary" />}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Inspected</Typography>
                        <Typography variant="body2">{selectedOperation.qualityMetrics.inspected}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Passed</Typography>
                        <Typography variant="body2">{selectedOperation.qualityMetrics.passed}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Thread Breaks</Typography>
                        <Chip
                          label={selectedOperation.qualityMetrics.thread_breaks}
                          size="small"
                          color={getThreadBreakColor(selectedOperation.qualityMetrics.thread_breaks)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Alignment Score</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating
                            value={selectedOperation.qualityMetrics.alignment_score || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {selectedOperation.qualityMetrics.alignment_score || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Color Matching Score</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating
                            value={selectedOperation.qualityMetrics.color_matching_score || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {selectedOperation.qualityMetrics.color_matching_score || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card sx={{ mb: 2 }}>
                  <CardHeader
                    title="Defects"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<BrokenIcon color="primary" />}
                  />
                  <CardContent>
                    {selectedOperation.qualityMetrics.defects.length === 0 ? (
                      <Typography variant="body2">No defects reported</Typography>
                    ) : (
                      <List dense>
                        {selectedOperation.qualityMetrics.defects.map((defect, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={defect.description}
                              secondary={`${defect.count} occurrences`}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                            <Chip
                              label={defect.type}
                              size="small"
                              color={getDefectSeverityColor(defect.type)}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader
                    title="First Piece Inspection"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<CheckCircleIcon color="primary" />}
                  />
                  <CardContent>
                    {!selectedOperation.qualityMetrics.firstPieceInspection.completed ? (
                      <Typography variant="body2">First piece inspection not completed</Typography>
                    ) : (
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Inspector</Typography>
                          <Typography variant="body2">{selectedOperation.qualityMetrics.firstPieceInspection.inspector}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Date</Typography>
                          <Typography variant="body2">{formatDate(selectedOperation.qualityMetrics.firstPieceInspection.date)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Result</Typography>
                          <Typography variant="body2">{selectedOperation.qualityMetrics.firstPieceInspection.result}</Typography>
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
            
            {/* Related Operations Tab */}
            {activeTab === 4 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>Upstream Operations</Typography>
                {selectedOperation.upstreamOperations.length === 0 ? (
                  <Typography variant="body2" sx={{ mb: 2 }}>No upstream operations</Typography>
                ) : (
                  <List dense sx={{ mb: 2 }}>
                    {selectedOperation.upstreamOperations.map((op, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${op.id} (${op.type})`}
                          secondary={`Status: ${op.status}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                        <Chip
                          label={op.status}
                          size="small"
                          color={getStatusColor(op.status)}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                
                <Typography variant="subtitle1" gutterBottom>Downstream Operations</Typography>
                {selectedOperation.downstreamOperations.length === 0 ? (
                  <Typography variant="body2">No downstream operations</Typography>
                ) : (
                  <List dense>
                    {selectedOperation.downstreamOperations.map((op, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${op.id} (${op.type})`}
                          secondary={`Status: ${op.status}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                        <Chip
                          label={op.status}
                          size="small"
                          color={getStatusColor(op.status)}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </Box>
        )}
      </Drawer>

      {/* Assign Operator Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Operator</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Operator</InputLabel>
            <Select label="Operator">
              {operators.map(operator => (
                <MenuItem key={operator.id} value={operator.id}>
                  {operator.name} ({operator.skillLevel})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Workstation</InputLabel>
            <Select label="Workstation">
              {embroideryMachines.map(machine => (
                <MenuItem key={machine.id} value={machine.id}>
                  {machine.name} ({machine.type}, {machine.needles} needles)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button onClick={handleSaveAssignment} variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>

      {/* Quality Check Dialog */}
      <Dialog open={qualityDialogOpen} onClose={handleCloseQualityDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Quality Check</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Inspected Quantity"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Passed Quantity"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Thread Breaks"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Defect Type</InputLabel>
                <Select label="Defect Type">
                  <MenuItem value="none">No Defects</MenuItem>
                  <MenuItem value="minor">Minor</MenuItem>
                  <MenuItem value="major">Major</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Defect Description"
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Alignment Score</Typography>
              <Rating precision={0.5} />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Color Matching Score</Typography>
              <Rating precision={0.5} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQualityDialog}>Cancel</Button>
          <Button onClick={handleSaveQualityCheck} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Machine Programming Dialog */}
      <Dialog open={machineDialogOpen} onClose={handleCloseMachineDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Machine Programming</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Speed (stitches/min)"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 300, max: 1200 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tension</InputLabel>
                <Select label="Tension">
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium-Low">Medium-Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Medium-High">Medium-High</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Hoop Size</InputLabel>
                <Select label="Hoop Size">
                  <MenuItem value="9cm x 9cm">9cm x 9cm</MenuItem>
                  <MenuItem value="12cm x 12cm">12cm x 12cm</MenuItem>
                  <MenuItem value="15cm x 15cm">15cm x 15cm</MenuItem>
                  <MenuItem value="20cm x 20cm">20cm x 20cm</MenuItem>
                  <MenuItem value="24cm x 24cm">24cm x 24cm</MenuItem>
                  <MenuItem value="30cm x 30cm">30cm x 30cm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Thread Sequence</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((needle) => (
                  <Chip
                    key={needle}
                    label={needle}
                    onClick={() => {}}
                    variant="outlined"
                    sx={{ width: 40 }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional Settings"
                fullWidth
                multiline
                rows={2}
                placeholder="Enter any additional machine settings..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMachineDialog}>Cancel</Button>
          <Button onClick={handleSaveMachineSettings} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Design Preview Dialog */}
      <Dialog open={designDialogOpen} onClose={handleCloseDesignDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedOperation ? selectedOperation.designName : 'Design Preview'}
            </Typography>
            <Box>
              <IconButton onClick={handleZoomOut}>
                <ZoomOutIcon />
              </IconButton>
              <Typography variant="body2" component="span" sx={{ mx: 1 }}>
                {zoomLevel}%
              </Typography>
              <IconButton onClick={handleZoomIn}>
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOperation && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  overflow: 'hidden',
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    transform: `scale(${zoomLevel / 100})`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    (Design preview image would be displayed here)
                  </Typography>
                  <Box
                    sx={{
                      width: 200,
                      height: 160,
                      bgcolor: '#f5f5f5',
                      border: '1px dashed #aaa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto'
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 60, color: '#aaa' }} />
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Color Palette</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedOperation.colorPalette.map((color, index) => (
                  <Tooltip key={index} title={`${color.name} (${color.thread_code})`}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        bgcolor: color.color,
                        border: '1px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Stitch Count</Typography>
                  <Typography variant="body1">{selectedOperation.parameters.stitch_count.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Dimensions</Typography>
                  <Typography variant="body1">{selectedOperation.parameters.dimensions}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Colors</Typography>
                  <Typography variant="body1">{selectedOperation.parameters.colors_count}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">Density</Typography>
                  <Typography variant="body1">{selectedOperation.designDetails.stitch_density}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDesignDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
