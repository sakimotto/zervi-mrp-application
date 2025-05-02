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
  ArrowForward as ArrowForwardIcon,
  Straighten as StraightenIcon,
  Layers as LayersIcon,
  Build as BuildIcon,
  Eco as EcoIcon
} from '@mui/icons-material';
import { specializedOperationsAPI } from '../../services/api';

export default function CuttingOperationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState([]);
  const [filteredOperations, setFilteredOperations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
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
  const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false);

  // Mock data for operators
  const operators = [
    { id: 1, name: 'Robert Chen', skillLevel: 'Expert', specialties: ['Laser Cutting', 'CNC Cutting'] },
    { id: 2, name: 'Maria Garcia', skillLevel: 'Intermediate', specialties: ['Die Cutting', 'Manual Cutting'] },
    { id: 3, name: 'James Wilson', skillLevel: 'Expert', specialties: ['Pattern Making', 'Nesting Optimization'] },
    { id: 4, name: 'Aisha Patel', skillLevel: 'Beginner', specialties: ['Manual Cutting'] },
    { id: 5, name: 'Thomas Lee', skillLevel: 'Advanced', specialties: ['Laser Cutting', 'Waterjet Cutting'] }
  ];

  // Mock data for cutting equipment
  const cuttingEquipment = [
    { id: 1, name: 'Laser Cutter 1', type: 'Laser', status: 'Operational', lastMaintenance: '2025-04-01', nextMaintenance: '2025-05-01' },
    { id: 2, name: 'CNC Cutter 2', type: 'CNC', status: 'Operational', lastMaintenance: '2025-03-15', nextMaintenance: '2025-05-15' },
    { id: 3, name: 'Die Cutter 1', type: 'Die', status: 'Maintenance Required', lastMaintenance: '2025-01-10', nextMaintenance: '2025-04-10' },
    { id: 4, name: 'Waterjet Cutter', type: 'Waterjet', status: 'Operational', lastMaintenance: '2025-04-05', nextMaintenance: '2025-06-05' },
    { id: 5, name: 'Manual Cutting Station 1', type: 'Manual', status: 'Operational', lastMaintenance: null, nextMaintenance: null }
  ];

  // Mock data for materials
  const materials = [
    'Nylon Ripstop',
    'Polyester Canvas',
    'Cordura',
    'Leather',
    'Vinyl',
    'Silnylon',
    'HDPE Fabric',
    'Dyneema Composite'
  ];
// Mock data for operations
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOperations = [
        {
          id: 1,
          operationId: 'CUT-2025001',
          manufacturingOrderId: 'MO-2025001',
          productName: 'Camping Tent - 2-Person',
          status: 'In Progress',
          priority: 'High',
          startTime: '2025-04-14T08:00:00',
          endTime: null,
          assignedOperator: 'Robert Chen',
          workstation: 'Laser Cutter 1',
          completedQuantity: 20,
          totalQuantity: 50,
          materialType: 'Nylon Ripstop',
          parameters: {
            cutting_method: 'laser',
            pattern_file: 'tent_body_v2.dxf',
            material_thickness_mm: 0.4,
            cut_speed: '30m/min',
            laser_power: '60%'
          },
          equipment_settings: {
            focus_height: '8mm',
            air_assist: 'enabled',
            cutting_bed: 'honeycomb'
          },
          materialConsumption: [
            { material: 'Nylon Ripstop - Green', consumed: 80, unit: 'sq.meters', allocated: 120, waste: 12 }
          ],
          cuttingPatterns: {
            parts: [
              { name: 'Tent Floor', quantity: 1, area: 4.2 },
              { name: 'Tent Walls', quantity: 4, area: 2.8 },
              { name: 'Tent Roof', quantity: 1, area: 3.5 },
              { name: 'Rainfly', quantity: 1, area: 5.0 }
            ],
            nestingEfficiency: 85,
            totalArea: 16.3,
            wastePercentage: 15
          },
          dimensions: {
            length: 220,
            width: 150,
            unit: 'cm',
            tolerances: '±0.5cm'
          },
          qualityMetrics: {
            inspected: 20,
            passed: 18,
            defects: [
              { type: 'minor', count: 1, description: 'Slight burn mark on edge' },
              { type: 'minor', count: 1, description: 'Small deviation in dimensions' }
            ],
            firstPieceInspection: {
              completed: true,
              inspector: 'Quality Team A',
              result: 'Approved with minor adjustments',
              date: '2025-04-14T09:30:00'
            }
          },
          equipmentMaintenance: {
            bladeCondition: 'Good',
            bladeReplacement: '2025-05-15',
            maintenanceNotes: 'Laser lens cleaned on 2025-04-10'
          },
          downstreamOperations: [
            { id: 'SEW-2025001', type: 'Sewing', status: 'Planned' },
            { id: 'QC-2025001', type: 'Quality Control', status: 'Planned' }
          ],
          notes: 'Ensure precise cutting of zipper openings'
        },
        {
          id: 2,
          operationId: 'CUT-2025002',
          manufacturingOrderId: 'MO-2025002',
          productName: 'Hiking Backpack - 40L',
          status: 'Planned',
          priority: 'Medium',
          startTime: '2025-04-18T08:00:00',
          endTime: null,
          assignedOperator: 'Maria Garcia',
          workstation: 'Die Cutter 1',
          completedQuantity: 0,
          totalQuantity: 100,
          materialType: 'Cordura',
          parameters: {
            cutting_method: 'die',
            pattern_file: 'backpack_panels_v3.die',
            material_thickness_mm: 0.6,
            pressure: 'high',
            die_type: 'steel rule'
          },
          equipment_settings: {
            stroke_depth: '0.8mm',
            cutting_pad: 'polyurethane',
            alignment: 'optical'
          },
          materialConsumption: [
            { material: 'Cordura 500D - Black', consumed: 0, unit: 'sq.meters', allocated: 200, waste: 0 }
          ],
          cuttingPatterns: {
            parts: [
              { name: 'Main Compartment', quantity: 1, area: 0.8 },
              { name: 'Side Pockets', quantity: 2, area: 0.3 },
              { name: 'Front Pocket', quantity: 1, area: 0.5 },
              { name: 'Shoulder Straps', quantity: 2, area: 0.4 },
              { name: 'Back Panel', quantity: 1, area: 0.7 }
            ],
            nestingEfficiency: 80,
            totalArea: 3.0,
            wastePercentage: 20
          },
          dimensions: {
            length: 60,
            width: 35,
            unit: 'cm',
            tolerances: '±0.3cm'
          },
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
          equipmentMaintenance: {
            bladeCondition: 'Needs Replacement',
            bladeReplacement: '2025-04-17',
            maintenanceNotes: 'Die needs sharpening before operation'
          },
          downstreamOperations: [
            { id: 'SEW-2025002', type: 'Sewing', status: 'Planned' },
            { id: 'QC-2025002', type: 'Quality Control', status: 'Planned' }
          ],
          notes: 'Use reinforced die for shoulder strap cutting'
        },
        {
          id: 3,
          operationId: 'CUT-2025003',
          manufacturingOrderId: 'MO-2025003',
          productName: 'Waterproof Jacket - Large',
          status: 'In Progress',
          priority: 'Medium',
          startTime: '2025-04-09T09:00:00',
          endTime: null,
          assignedOperator: 'Thomas Lee',
          workstation: 'Laser Cutter 1',
          completedQuantity: 35,
          totalQuantity: 75,
          materialType: 'HDPE Fabric',
          parameters: {
            cutting_method: 'laser',
            pattern_file: 'jacket_panels_v1.dxf',
            material_thickness_mm: 0.3,
            cut_speed: '25m/min',
            laser_power: '50%'
          },
          equipment_settings: {
            focus_height: '7mm',
            air_assist: 'enabled',
            cutting_bed: 'honeycomb'
          },
          materialConsumption: [
            { material: 'HDPE Waterproof Fabric - Navy', consumed: 105, unit: 'sq.meters', allocated: 225, waste: 18 }
          ],
          cuttingPatterns: {
            parts: [
              { name: 'Front Panels', quantity: 2, area: 0.6 },
              { name: 'Back Panel', quantity: 1, area: 0.7 },
              { name: 'Sleeves', quantity: 2, area: 0.5 },
              { name: 'Hood', quantity: 1, area: 0.3 },
              { name: 'Pockets', quantity: 3, area: 0.2 }
            ],
            nestingEfficiency: 82,
            totalArea: 3.6,
            wastePercentage: 18
          },
          dimensions: {
            length: 75,
            width: 65,
            unit: 'cm',
            tolerances: '±0.2cm'
          },
          qualityMetrics: {
            inspected: 35,
            passed: 33,
            defects: [
              { type: 'minor', count: 2, description: 'Small deviation in sleeve pattern' }
            ],
            firstPieceInspection: {
              completed: true,
              inspector: 'Quality Team B',
              result: 'Approved',
              date: '2025-04-09T10:15:00'
            }
          },
          equipmentMaintenance: {
            bladeCondition: 'Excellent',
            bladeReplacement: '2025-06-10',
            maintenanceNotes: 'New laser lens installed on 2025-04-05'
          },
          downstreamOperations: [
            { id: 'SEW-2025003', type: 'Sewing', status: 'Planned' },
            { id: 'TAPE-2025001', type: 'Seam Taping', status: 'Planned' },
            { id: 'QC-2025003', type: 'Quality Control', status: 'Planned' }
          ],
          notes: 'Ensure precise cutting for waterproof seam allowances'
        },
        {
          id: 4,
          operationId: 'CUT-2025004',
          manufacturingOrderId: 'MO-2025004',
          productName: 'Sleeping Bag - Winter',
          status: 'Completed',
          priority: 'Low',
          startTime: '2025-04-04T08:00:00',
          endTime: '2025-04-14T15:00:00',
          assignedOperator: 'James Wilson',
          workstation: 'CNC Cutter 2',
          completedQuantity: 30,
          totalQuantity: 30,
          materialType: 'Silnylon',
          parameters: {
            cutting_method: 'cnc',
            pattern_file: 'sleeping_bag_winter_v2.cut',
            material_thickness_mm: 0.2,
            cut_speed: '20m/min',
            tool_type: 'rotary blade'
          },
          equipment_settings: {
            blade_depth: '0.3mm',
            vacuum_strength: 'high',
            feed_rate: '300mm/min'
          },
          materialConsumption: [
            { material: 'Silnylon - Green', consumed: 75, unit: 'sq.meters', allocated: 90, waste: 15 },
            { material: 'Insulation Batting', consumed: 60, unit: 'sq.meters', allocated: 65, waste: 5 }
          ],
          cuttingPatterns: {
            parts: [
              { name: 'Outer Shell', quantity: 1, area: 2.2 },
              { name: 'Inner Lining', quantity: 1, area: 2.0 },
              { name: 'Insulation Layer', quantity: 1, area: 2.1 },
              { name: 'Hood Section', quantity: 1, area: 0.5 },
              { name: 'Foot Box', quantity: 1, area: 0.7 }
            ],
            nestingEfficiency: 83,
            totalArea: 7.5,
            wastePercentage: 17
          },
          dimensions: {
            length: 220,
            width: 80,
            unit: 'cm',
            tolerances: '±0.3cm'
          },
          qualityMetrics: {
            inspected: 30,
            passed: 30,
            defects: [],
            firstPieceInspection: {
              completed: true,
              inspector: 'Quality Team A',
              result: 'Approved',
              date: '2025-04-04T09:45:00'
            }
          },
          equipmentMaintenance: {
            bladeCondition: 'Good',
            bladeReplacement: '2025-05-20',
            maintenanceNotes: 'Blade rotated on 2025-04-03'
          },
          downstreamOperations: [
            { id: 'SEW-2025004', type: 'Sewing', status: 'In Progress' },
            { id: 'QC-2025004', type: 'Quality Control', status: 'Planned' }
          ],
          notes: 'Ensure precise alignment of insulation and shell layers'
        },
        {
          id: 5,
          operationId: 'CUT-2025005',
          manufacturingOrderId: 'MO-2025005',
          productName: 'Camping Chair',
          status: 'Planned',
          priority: 'High',
          startTime: '2025-04-23T08:00:00',
          endTime: null,
          assignedOperator: null,
          workstation: null,
          completedQuantity: 0,
          totalQuantity: 120,
          materialType: 'Polyester Canvas',
          parameters: {
            cutting_method: 'cnc',
            pattern_file: 'camping_chair_v3.cut',
            material_thickness_mm: 0.8,
            cut_speed: '15m/min',
            tool_type: 'drag knife'
          },
          equipment_settings: {
            blade_depth: '1.0mm',
            vacuum_strength: 'high',
            feed_rate: '250mm/min'
          },
          materialConsumption: [
            { material: 'Polyester Canvas - Black', consumed: 0, unit: 'sq.meters', allocated: 240, waste: 0 }
          ],
          cuttingPatterns: {
            parts: [
              { name: 'Seat Panel', quantity: 1, area: 0.6 },
              { name: 'Back Panel', quantity: 1, area: 0.7 },
              { name: 'Side Panels', quantity: 2, area: 0.4 },
              { name: 'Reinforcement Patches', quantity: 4, area: 0.1 }
            ],
            nestingEfficiency: 78,
            totalArea: 2.5,
            wastePercentage: 22
          },
          dimensions: {
            length: 60,
            width: 55,
            unit: 'cm',
            tolerances: '±0.5cm'
          },
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
          equipmentMaintenance: {
            bladeCondition: 'Unknown',
            bladeReplacement: null,
            maintenanceNotes: 'Equipment to be assigned'
          },
          downstreamOperations: [
            { id: 'SEW-2025005', type: 'Sewing', status: 'Planned' },
            { id: 'ASSM-2025001', type: 'Assembly', status: 'Planned' },
            { id: 'QC-2025005', type: 'Quality Control', status: 'Planned' }
          ],
          notes: 'Reinforce cutting for high-stress areas'
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
    //     const response = await specializedOperationsAPI.getAllCuttingOperations();
    //     setOperations(response.data);
    //     setFilteredOperations(response.data);
    //   } catch (error) {
    //     console.error('Error fetching cutting operations:', error);
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
    
    // Apply material filter
    if (materialFilter !== 'all') {
      result = result.filter(operation => 
        operation.materialType === materialFilter
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
          operation.manufacturingOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          operation.materialType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOperations(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, operatorFilter, materialFilter, startDate, endDate, operations]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleOperatorFilterChange = (event) => {
    setOperatorFilter(event.target.value);
  };

  const handleMaterialFilterChange = (event) => {
    setMaterialFilter(event.target.value);
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

  const handleEquipmentMaintenance = (operationId) => {
    setSelectedOperation(operations.find(op => op.id === operationId));
    setEquipmentDialogOpen(true);
  };

  const handleCloseEquipmentDialog = () => {
    setEquipmentDialogOpen(false);
  };

  const handleSaveEquipmentMaintenance = () => {
    // In real implementation, would save the equipment maintenance
    setEquipmentDialogOpen(false);
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

  // Get equipment status color
  const getEquipmentStatusColor = (status) => {
    switch (status) {
      case 'Operational':
        return 'success';
      case 'Maintenance Required':
        return 'warning';
      case 'Out of Service':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get blade condition color
  const getBladeConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent':
        return 'success';
      case 'Good':
        return 'primary';
      case 'Fair':
        return 'warning';
      case 'Needs Replacement':
        return 'error';
      case 'Unknown':
        return 'default';
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
          Cutting Operations
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => console.log('Create new cutting operation')}
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
            <Grid item xs={12} sm={6} md={2}>
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={operatorFilter}
                  label="Operator"
                  onChange={handleOperatorFilterChange}
                >
                  <MenuItem value="all">All Operators</MenuItem>
                  {operators.map(operator => (
                    <MenuItem key={operator.id} value={operator.name}>{operator.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Material</InputLabel>
                <Select
                  value={materialFilter}
                  label="Material"
                  onChange={handleMaterialFilterChange}
                >
                  <MenuItem value="all">All Materials</MenuItem>
                  {materials.map((material, index) => (
                    <MenuItem key={index} value={material}>{material}</MenuItem>
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
                <TableCell>Material</TableCell>
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
                    <TableCell>{operation.materialType}</TableCell>
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
                        <Tooltip title="Equipment Maintenance">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEquipmentMaintenance(operation.id);
                            }}
                          >
                            <BuildIcon fontSize="small" />
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
                <strong>Material:</strong> {selectedOperation.materialType}
              </Typography>
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
              <Tab icon={<StraightenIcon />} label="Cutting Details" />
              <Tab icon={<LayersIcon />} label="Material Optimization" />
              <Tab icon={<BuildIcon />} label="Equipment" />
              <Tab icon={<BugReportIcon />} label="Quality Control" />
            </Tabs>
            
            {/* Cutting Details Tab */}
            {activeTab === 0 && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader title="Cutting Specifications" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Cutting Parameters</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Cutting Method" 
                            secondary={selectedOperation.parameters.cutting_method} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Pattern File" 
                            secondary={selectedOperation.parameters.pattern_file} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Material Thickness (mm)" 
                            secondary={selectedOperation.parameters.material_thickness_mm} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Cut Speed" 
                            secondary={selectedOperation.parameters.cut_speed} 
                          />
                        </ListItem>
                        {selectedOperation.parameters.laser_power && (
                          <ListItem>
                            <ListItemText 
                              primary="Laser Power" 
                              secondary={selectedOperation.parameters.laser_power} 
                            />
                          </ListItem>
                        )}
                        {selectedOperation.parameters.tool_type && (
                          <ListItem>
                            <ListItemText 
                              primary="Tool Type" 
                              secondary={selectedOperation.parameters.tool_type} 
                            />
                          </ListItem>
                        )}
                        {selectedOperation.parameters.pressure && (
                          <ListItem>
                            <ListItemText 
                              primary="Pressure" 
                              secondary={selectedOperation.parameters.pressure} 
                            />
                          </ListItem>
                        )}
                        {selectedOperation.parameters.die_type && (
                          <ListItem>
                            <ListItemText 
                              primary="Die Type" 
                              secondary={selectedOperation.parameters.die_type} 
                            />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Dimensions & Tolerances</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Length" 
                            secondary={`${selectedOperation.dimensions.length} ${selectedOperation.dimensions.unit}`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Width" 
                            secondary={`${selectedOperation.dimensions.width} ${selectedOperation.dimensions.unit}`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Tolerances" 
                            secondary={selectedOperation.dimensions.tolerances} 
                          />
                        </ListItem>
                      </List>
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Equipment Settings</Typography>
                      <List dense>
                        {Object.entries(selectedOperation.equipment_settings).map(([key, value]) => (
                          <ListItem key={key}>
                            <ListItemText 
                              primary={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                              secondary={value} 
                            />
                          </ListItem>
                        ))}
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
            
            {/* Material Optimization Tab */}
            {activeTab === 1 && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader 
                  title="Material Optimization" 
                  subheader={`Nesting Efficiency: ${selectedOperation.cuttingPatterns.nestingEfficiency}% | Waste: ${selectedOperation.cuttingPatterns.wastePercentage}%`}
                />
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>Cutting Pattern Parts</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Part Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Area (sq.m)</TableCell>
                          <TableCell align="right">Total Area (sq.m)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOperation.cuttingPatterns.parts.map((part, index) => (
                          <TableRow key={index}>
                            <TableCell>{part.name}</TableCell>
                            <TableCell align="right">{part.quantity}</TableCell>
                            <TableCell align="right">{part.area.toFixed(2)}</TableCell>
                            <TableCell align="right">{(part.area * part.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3}><strong>Total Pattern Area</strong></TableCell>
                          <TableCell align="right"><strong>{selectedOperation.cuttingPatterns.totalArea.toFixed(2)}</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>Material Consumption</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Material</TableCell>
                          <TableCell align="right">Consumed</TableCell>
                          <TableCell align="right">Allocated</TableCell>
                          <TableCell align="right">Waste</TableCell>
                          <TableCell align="right">Waste %</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOperation.materialConsumption.map((material, index) => (
                          <TableRow key={index}>
                            <TableCell>{material.material}</TableCell>
                            <TableCell align="right">{material.consumed} {material.unit}</TableCell>
                            <TableCell align="right">{material.allocated} {material.unit}</TableCell>
                            <TableCell align="right">{material.waste} {material.unit}</TableCell>
                            <TableCell align="right">
                              {material.allocated > 0 ? Math.round((material.waste / material.allocated) * 100) : 0}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>Material Yield Metrics</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Nesting Efficiency:</strong> {selectedOperation.cuttingPatterns.nestingEfficiency}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Waste Percentage:</strong> {selectedOperation.cuttingPatterns.wastePercentage}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Total Pattern Area:</strong> {selectedOperation.cuttingPatterns.totalArea.toFixed(2)} sq.m
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Material Utilization:</strong> {(100 - selectedOperation.cuttingPatterns.wastePercentage)}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            )}
            
            {/* Equipment Tab */}
            {activeTab === 2 && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader title="Equipment & Maintenance" />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Equipment Status</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Workstation:</strong> {selectedOperation.workstation || 'Not assigned'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Cutting Method:</strong> {selectedOperation.parameters.cutting_method}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            <strong>Blade/Tool Condition:</strong>
                          </Typography>
                          <Chip 
                            label={selectedOperation.equipmentMaintenance.bladeCondition} 
                            color={getBladeConditionColor(selectedOperation.equipmentMaintenance.bladeCondition)} 
                            size="small" 
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Maintenance Schedule</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Next Blade Replacement:</strong> {formatDate(selectedOperation.equipmentMaintenance.bladeReplacement) || 'Not scheduled'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Maintenance Notes:</strong> {selectedOperation.equipmentMaintenance.maintenanceNotes || 'No notes available'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Equipment Settings</Typography>
                    <List dense>
                      {Object.entries(selectedOperation.equipment_settings).map(([key, value]) => (
                        <ListItem key={key}>
                          <ListItemText 
                            primary={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                            secondary={value} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            )}
            
            {/* Quality Control Tab */}
            {activeTab === 3 && (
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
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Downstream Operations</Typography>
                    {selectedOperation.downstreamOperations.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Operation ID</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedOperation.downstreamOperations.map((op, index) => (
                              <TableRow key={index}>
                                <TableCell>{op.id}</TableCell>
                                <TableCell>{op.type}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={op.status} 
                                    color={getStatusColor(op.status)} 
                                    size="small" 
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No downstream operations defined
                      </Typography>
                    )}
                  </Box>
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
              {cuttingEquipment.map(equipment => (
                <MenuItem key={equipment.id} value={equipment.name}>
                  {equipment.name} ({equipment.type}) - 
                  <Chip 
                    label={equipment.status} 
                    color={getEquipmentStatusColor(equipment.status)} 
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </MenuItem>
              ))}
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
      
      {/* Equipment Maintenance Dialog */}
      <Dialog open={equipmentDialogOpen} onClose={handleCloseEquipmentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Equipment Maintenance
          {selectedOperation && (
            <Typography variant="subtitle2" color="text.secondary">
              {selectedOperation.operationId} - {selectedOperation.workstation || 'Unassigned'}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>Blade/Tool Condition</Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Condition</InputLabel>
            <Select
              value="good"
              label="Condition"
              onChange={() => {}}
            >
              <MenuItem value="excellent">Excellent</MenuItem>
              <MenuItem value="good">Good</MenuItem>
              <MenuItem value="fair">Fair</MenuItem>
              <MenuItem value="needs_replacement">Needs Replacement</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" gutterBottom>Maintenance Schedule</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Last Maintenance Date"
                  value={new Date()}
                  onChange={() => {}}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Next Blade Replacement"
                  value={new Date()}
                  onChange={() => {}}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle2" gutterBottom>Maintenance Notes</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Enter maintenance notes, issues, or observations"
            defaultValue={selectedOperation?.equipmentMaintenance?.maintenanceNotes || ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEquipmentDialog}>Cancel</Button>
          <Button onClick={handleSaveEquipmentMaintenance} variant="contained" color="primary">
            Save Maintenance Record
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
          
          <Typography variant="subtitle2" gutterBottom>Dimension Verification</Typography>
          <FormGroup sx={{ mb: 3 }}>
            <FormControlLabel 
              control={<Checkbox />} 
              label="Dimensions within tolerance" 
            />
            <TextField
              label="Notes"
              fullWidth
              placeholder="Notes about dimension verification"
              sx={{ mt: 1 }}
            />
          </FormGroup>
          
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
