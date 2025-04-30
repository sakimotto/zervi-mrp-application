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
