import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Stack,
  Avatar
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PriorityHigh as PriorityHighIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Straighten as StraightenIcon,
  Layers as LayersIcon,
  ColorLens as ColorLensIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OperationsDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [operationsData, setOperationsData] = useState({
    cutting: [],
    sewing: [],
    embroidery: [],
    laminating: []
  });
  const [summaryStats, setSummaryStats] = useState({
    totalOperations: 0,
    plannedOperations: 0,
    inProgressOperations: 0,
    completedOperations: 0,
    onHoldOperations: 0,
    cancelledOperations: 0,
    todayOperations: 0,
    thisWeekOperations: 0,
    completionRate: 0,
    resourceUtilization: 0
  });
  const [criticalOperations, setCriticalOperations] = useState([]);
  const [resourceAllocation, setResourceAllocation] = useState({
    equipment: [],
    operators: []
  });
// Mock data for operations
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock cutting operations
      const mockCuttingOperations = [
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
          materialType: 'Nylon Ripstop'
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
          materialType: 'Cordura'
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
          materialType: 'HDPE Fabric'
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
          materialType: 'Silnylon'
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
          materialType: 'Polyester Canvas'
        }
      ];

      // Mock sewing operations
      const mockSewingOperations = [
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
          totalQuantity: 50
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
          totalQuantity: 100
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
          totalQuantity: 75
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
          totalQuantity: 30
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
          totalQuantity: 120
        }
      ];

      // Mock embroidery operations
      const mockEmbroideryOperations = [
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
          designName: 'Zervitek Corporate Logo'
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
          designName: 'Mountain Adventure Logo'
        }
      ];

      // Mock laminating operations
      const mockLaminatingOperations = [
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

      // Set operations data
      setOperationsData({
        cutting: mockCuttingOperations,
        sewing: mockSewingOperations,
        embroidery: mockEmbroideryOperations,
        laminating: mockLaminatingOperations
      });

      // Calculate summary statistics
      const allOperations = [
        ...mockCuttingOperations,
        ...mockSewingOperations,
        ...mockEmbroideryOperations,
        ...mockLaminatingOperations
      ];

      const totalOps = allOperations.length;
      const plannedOps = allOperations.filter(op => op.status === 'Planned').length;
      const inProgressOps = allOperations.filter(op => op.status === 'In Progress').length;
      const completedOps = allOperations.filter(op => op.status === 'Completed').length;
      const onHoldOps = allOperations.filter(op => op.status === 'On Hold').length;
      const cancelledOps = allOperations.filter(op => op.status === 'Cancelled').length;

      // Calculate today's operations
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const todayOps = allOperations.filter(op => {
        const opDate = new Date(op.startTime).toISOString().split('T')[0];
        return opDate === todayString;
      }).length;

      // Calculate this week's operations
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(today);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const thisWeekOps = allOperations.filter(op => {
        const opDate = new Date(op.startTime);
        return opDate >= startOfWeek && opDate <= endOfWeek;
      }).length;

      // Calculate completion rate
      const totalCompletedQuantity = allOperations.reduce((sum, op) => sum + op.completedQuantity, 0);
      const totalQuantity = allOperations.reduce((sum, op) => sum + op.totalQuantity, 0);
      const completionRate = totalQuantity > 0 ? (totalCompletedQuantity / totalQuantity) * 100 : 0;

      // Calculate resource utilization (mock data)
      const resourceUtilization = 78.5; // Percentage

      setSummaryStats({
        totalOperations: totalOps,
        plannedOperations: plannedOps,
        inProgressOperations: inProgressOps,
        completedOperations: completedOps,
        onHoldOperations: onHoldOps,
        cancelledOperations: cancelledOps,
        todayOperations: todayOps,
        thisWeekOperations: thisWeekOps,
        completionRate: completionRate,
        resourceUtilization: resourceUtilization
      });

      // Set critical operations
      const criticalOps = allOperations.filter(op => {
        // Operations that are high priority and in progress or planned
        const isHighPriority = op.priority === 'High';
        const isActiveStatus = op.status === 'In Progress' || op.status === 'Planned';
        
        // Check if operation is late
        const dueDate = new Date(op.endTime || '2099-12-31');
        const isLate = dueDate < today && op.status !== 'Completed';
        
        // Check if operation has low completion percentage but due date is approaching
        const completionPercentage = op.totalQuantity > 0 ? (op.completedQuantity / op.totalQuantity) * 100 : 0;
        const isDueSoon = dueDate > today && dueDate <= endOfWeek;
        const isLowCompletion = completionPercentage < 30;
        
        return (isHighPriority && isActiveStatus) || isLate || (isDueSoon && isLowCompletion);
      });

      setCriticalOperations(criticalOps);

      // Set resource allocation data
      const equipmentData = [
        { name: 'Laser Cutter 1', utilization: 85, availability: 15, type: 'Cutting' },
        { name: 'Die Cutter 1', utilization: 45, availability: 55, type: 'Cutting' },
        { name: 'CNC Cutter 2', utilization: 60, availability: 40, type: 'Cutting' },
        { name: 'Sewing Station 1', utilization: 70, availability: 30, type: 'Sewing' },
        { name: 'Sewing Station 2', utilization: 90, availability: 10, type: 'Sewing' },
        { name: 'Sewing Station 3', utilization: 75, availability: 25, type: 'Sewing' },
        { name: 'Sewing Station 5', utilization: 80, availability: 20, type: 'Sewing' },
        { name: 'Tajima TFMX-C1506', utilization: 95, availability: 5, type: 'Embroidery' },
        { name: 'Barudan BEVT-Z1506C', utilization: 50, availability: 50, type: 'Embroidery' },
        { name: 'Mimaki LA-160W', utilization: 75, availability: 25, type: 'Laminating' },
        { name: 'GMP Excelam Q1400', utilization: 30, availability: 70, type: 'Laminating' },
        { name: 'D&K System 2700', utilization: 65, availability: 35, type: 'Laminating' }
      ];

      const operatorData = [
        { name: 'Robert Chen', workload: 90, capacity: 100, efficiency: 95, type: 'Cutting' },
        { name: 'Maria Garcia', workload: 70, capacity: 100, efficiency: 85, type: 'Multiple' },
        { name: 'Thomas Lee', workload: 85, capacity: 100, efficiency: 90, type: 'Cutting' },
        { name: 'James Wilson', workload: 60, capacity: 100, efficiency: 92, type: 'Cutting' },
        { name: 'Sarah Johnson', workload: 95, capacity: 100, efficiency: 88, type: 'Sewing' },
        { name: 'Michael Chen', workload: 50, capacity: 100, efficiency: 75, type: 'Sewing' },
        { name: 'Emily Rodriguez', workload: 80, capacity: 100, efficiency: 94, type: 'Sewing' },
        { name: 'Lisa Patel', workload: 65, capacity: 100, efficiency: 89, type: 'Sewing' },
        { name: 'Jennifer Wu', workload: 85, capacity: 100, efficiency: 96, type: 'Embroidery' },
        { name: 'Carlos Mendez', workload: 40, capacity: 100, efficiency: 82, type: 'Embroidery' },
        { name: 'Thomas Müller', workload: 75, capacity: 100, efficiency: 91, type: 'Laminating' }
      ];

      setResourceAllocation({
        equipment: equipmentData,
        operators: operatorData
      });

      setLoading(false);
    }, 1500);
  }, []);
const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleNavigateToOperations = (type) => {
    switch (type) {
      case 'cutting':
        navigate('/operations/cutting');
        break;
      case 'sewing':
        navigate('/operations/sewing');
        break;
      case 'embroidery':
        navigate('/operations/embroidery');
        break;
      case 'laminating':
        navigate('/operations/laminating');
        break;
      default:
        break;
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const calculateProgress = (completed, total) => {
    if (!total || total === 0) return 0;
    return (completed / total) * 100;
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

  // Prepare data for status distribution chart
  const prepareStatusData = (operations) => {
    const statusCounts = {
      'Planned': 0,
      'In Progress': 0,
      'Completed': 0,
      'On Hold': 0,
      'Cancelled': 0
    };

    operations.forEach(op => {
      if (statusCounts[op.status] !== undefined) {
        statusCounts[op.status]++;
      }
    });

    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
  };

  // Prepare data for priority distribution chart
  const preparePriorityData = (operations) => {
    const priorityCounts = {
      'High': 0,
      'Medium': 0,
      'Low': 0
    };

    operations.forEach(op => {
      if (priorityCounts[op.priority] !== undefined) {
        priorityCounts[op.priority]++;
      }
    });

    return Object.keys(priorityCounts).map(priority => ({
      name: priority,
      value: priorityCounts[priority]
    }));
  };

  // Get operations for the active tab
  const getActiveOperations = () => {
    switch (activeTab) {
      case 0:
        return [...operationsData.cutting, ...operationsData.sewing, ...operationsData.embroidery, ...operationsData.laminating];
      case 1:
        return operationsData.cutting;
      case 2:
        return operationsData.sewing;
      case 3:
        return operationsData.embroidery;
      case 4:
        return operationsData.laminating;
      default:
        return [];
    }
  };

  const activeOperations = getActiveOperations();
  const statusData = prepareStatusData(activeOperations);
  const priorityData = preparePriorityData(activeOperations);

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];
  const STATUS_COLORS = {
    'Planned': '#9c27b0',
    'In Progress': '#1976d2',
    'Completed': '#4caf50',
    'On Hold': '#ff9800',
    'Cancelled': '#9e9e9e'
  };
  
  const PRIORITY_COLORS = {
    'High': '#f44336',
    'Medium': '#ff9800',
    'Low': '#2196f3'
  };
return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Operations Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Statistics */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Summary Statistics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Operations
                    </Typography>
                    <Typography variant="h4">
                      {summaryStats.totalOperations}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            Planned: {summaryStats.plannedOperations}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            In Progress: {summaryStats.inProgressOperations}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            Completed: {summaryStats.completedOperations}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            On Hold: {summaryStats.onHoldOperations}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Scheduled Operations
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h4">
                        {summaryStats.todayOperations}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        Today
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <ScheduleIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="h4">
                        {summaryStats.thisWeekOperations}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        This Week
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Completion Rate
                    </Typography>
                    <Typography variant="h4">
                      {summaryStats.completionRate.toFixed(1)}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={summaryStats.completionRate} 
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Overall completion rate across all operations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Resource Utilization
                    </Typography>
                    <Typography variant="h4">
                      {summaryStats.resourceUtilization.toFixed(1)}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={summaryStats.resourceUtilization} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: summaryStats.resourceUtilization > 90 ? '#f44336' : 
                                              summaryStats.resourceUtilization > 75 ? '#ff9800' : '#4caf50'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Average equipment and operator utilization
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Operations Overview */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Operations Overview
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="operations tabs">
                <Tab label="All Operations" />
                <Tab label="Cutting" />
                <Tab label="Sewing" />
                <Tab label="Embroidery" />
                <Tab label="Laminating" />
              </Tabs>
            </Box>

            <Grid container spacing={3}>
              {/* Status Distribution Chart */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Status Distribution" />
                  <CardContent>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Priority Distribution Chart */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Priority Distribution" />
                  <CardContent>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={priorityData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="value" name="Operations Count">
                            {priorityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Operations Table */}
              <Grid item xs={12}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Operation ID</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Operator</TableCell>
                        <TableCell>Start Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeOperations.slice(0, 5).map((operation) => {
                        const statusColor = getStatusColor(operation.status);
                        const progress = calculateProgress(
                          operation.completedQuantity,
                          operation.totalQuantity
                        );
                        
                        // Determine operation type from ID
                        let operationType = 'Unknown';
                        if (operation.operationId.startsWith('CUT')) operationType = 'Cutting';
                        else if (operation.operationId.startsWith('SEW')) operationType = 'Sewing';
                        else if (operation.operationId.startsWith('EMB')) operationType = 'Embroidery';
                        else if (operation.operationId.startsWith('LAM')) operationType = 'Laminating';

                        return (
                          <TableRow key={operation.id} hover>
                            <TableCell>{operation.operationId}</TableCell>
                            <TableCell>{operation.productName}</TableCell>
                            <TableCell>{operationType}</TableCell>
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
                            <TableCell>
                              <Chip
                                label={operation.priority}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(0,0,0,0.08)',
                                  color: getPriorityColor(operation.priority)
                                }}
                              />
                            </TableCell>
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
                            </TableCell>
                            <TableCell>{operation.assignedOperator || 'Unassigned'}</TableCell>
                            <TableCell>{formatDate(operation.startTime)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {activeOperations.length > 5 && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleNavigateToOperations(activeTab === 0 ? 'all' : ['cutting', 'sewing', 'embroidery', 'laminating'][activeTab - 1])}
                    >
                      View All {activeTab === 0 ? 'Operations' : ['Cutting', 'Sewing', 'Embroidery', 'Laminating'][activeTab - 1] + ' Operations'}
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Critical Operations */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Critical Operations
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Operation ID</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {criticalOperations.map((operation) => {
                        const statusColor = getStatusColor(operation.status);
                        const progress = calculateProgress(
                          operation.completedQuantity,
                          operation.totalQuantity
                        );
                        
                        // Determine operation type from ID
                        let operationType = 'Unknown';
                        if (operation.operationId.startsWith('CUT')) operationType = 'Cutting';
                        else if (operation.operationId.startsWith('SEW')) operationType = 'Sewing';
                        else if (operation.operationId.startsWith('EMB')) operationType = 'Embroidery';
                        else if (operation.operationId.startsWith('LAM')) operationType = 'Laminating';

                        // Determine issue
                        let issue = '';
                        let issueIcon = null;
                        
                        if (operation.priority === 'High' && operation.status !== 'Completed') {
                          issue = 'High Priority';
                          issueIcon = <PriorityHighIcon color="error" />;
                        } else if (progress < 30 && new Date(operation.startTime) < new Date()) {
                          issue = 'Low Completion Rate';
                          issueIcon = <WarningIcon color="warning" />;
                        } else if (!operation.assignedOperator) {
                          issue = 'Unassigned';
                          issueIcon = <PersonIcon color="info" />;
                        }

                        return (
                          <TableRow key={operation.id} hover>
                            <TableCell>{operation.operationId}</TableCell>
                            <TableCell>{operation.productName}</TableCell>
                            <TableCell>{operationType}</TableCell>
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
                            <TableCell>
                              <Chip
                                label={operation.priority}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(0,0,0,0.08)',
                                  color: getPriorityColor(operation.priority)
                                }}
                              />
                            </TableCell>
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
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {issueIcon}
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  {issue}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => {
                                  if (operationType === 'Cutting') handleNavigateToOperations('cutting');
                                  else if (operationType === 'Sewing') handleNavigateToOperations('sewing');
                                  else if (operationType === 'Embroidery') handleNavigateToOperations('embroidery');
                                  else if (operationType === 'Laminating') handleNavigateToOperations('laminating');
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {criticalOperations.length === 0 && (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body1">No critical operations at this time</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Resource Allocation */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resource Allocation
            </Typography>
            <Grid container spacing={3}>
              {/* Equipment Utilization */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Equipment Utilization" />
                  <CardContent>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={resourceAllocation.equipment.slice(0, 6)}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 100,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="utilization" name="Utilization %" fill="#8884d8" />
                          <Bar dataKey="availability" name="Availability %" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Operator Workload */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Operator Workload" />
                  <CardContent>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={resourceAllocation.operators.slice(0, 6)}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 100,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="workload" name="Workload %" fill="#8884d8" />
                          <Bar dataKey="efficiency" name="Efficiency %" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Quick Navigation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Navigation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.03)' }
                  }}
                  onClick={() => handleNavigateToOperations('cutting')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1565c0', mb: 1, width: 56, height: 56 }}>
                        <StraightenIcon />
                      </Avatar>
                      <Typography variant="h6">Cutting</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {operationsData.cutting.length} Operations
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.03)' }
                  }}
                  onClick={() => handleNavigateToOperations('sewing')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#f3e5f5', color: '#6a1b9a', mb: 1, width: 56, height: 56 }}>
                        <BuildIcon />
                      </Avatar>
                      <Typography variant="h6">Sewing</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {operationsData.sewing.length} Operations
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.03)' }
                  }}
                  onClick={() => handleNavigateToOperations('embroidery')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#fff8e1', color: '#f57f17', mb: 1, width: 56, height: 56 }}>
                        <ColorLensIcon />
                      </Avatar>
                      <Typography variant="h6">Embroidery</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {operationsData.embroidery.length} Operations
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.03)' }
                  }}
                  onClick={() => handleNavigateToOperations('laminating')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', mb: 1, width: 56, height: 56 }}>
                        <LayersIcon />
                      </Avatar>
                      <Typography variant="h6">Laminating</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {operationsData.laminating.length} Operations
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
}