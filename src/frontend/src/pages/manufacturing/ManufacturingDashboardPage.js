import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  LinearProgress,
  IconButton,
  Tooltip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
  ArrowBack as ArrowBackIcon,
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
  Close as CloseIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { manufacturingOrderAPI } from '../../services/api';

export default function ManufacturingDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const [workstationFilter, setWorkstationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [operationTypeFilter, setOperationTypeFilter] = useState('all');
  const [criticalOperations, setCriticalOperations] = useState([]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  // Summary metrics state
  const [summaryStats, setSummaryStats] = useState({
    totalOrders: 0,
    plannedOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    onHoldOrders: 0,
    cancelledOrders: 0,
    onTimeDeliveryRate: 0,
    avgCycleTime: 0,
    unitsProduced: 0,
    unitsTarget: 0,
    defectRate: 0,
    firstPassYield: 0,
    resourceUtilization: 0,
    bottleneckOperations: [],
    operationsByType: {
      cutting: 0,
      sewing: 0,
      embroidery: 0,
      laminating: 0
    },
    lateOperations: 0,
    qualityIssues: 0,
    resourceConflicts: 0
  });

  // Mock data for workstations
  const workstations = [
    { id: 1, name: 'Cutting Station 1', type: 'cutting' },
    { id: 2, name: 'Cutting Station 2', type: 'cutting' },
    { id: 3, name: 'Sewing Station 1', type: 'sewing' },
    { id: 4, name: 'Sewing Station 2', type: 'sewing' },
    { id: 5, name: 'Laminating Station', type: 'laminating' },
    { id: 6, name: 'Embroidery Station', type: 'embroidery' },
  ];

  // Fetch orders and calculate metrics
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data - in real implementation would be API calls
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
              deliveredOnTime: true,
              defects: 2,
              firstPass: 13,
              assignedTo: 'Production Team A',
              workstationId: 1,
              operations: [
                { id: 1, name: 'Cutting', startDate: '2025-05-01', endDate: '2025-05-03', status: 'Completed', workstationId: 1, cycleTime: 48 },
                { id: 2, name: 'Sewing', startDate: '2025-05-03', endDate: '2025-05-07', status: 'In Progress', workstationId: 3, cycleTime: 96 },
                { id: 3, name: 'Quality Check', startDate: '2025-05-07', endDate: '2025-05-09', status: 'Not Started', workstationId: null, cycleTime: 48 }
              ]
            },
            // Additional mock orders would be added here
          ];

          setOrders(mockOrders);
          setFilteredOrders(mockOrders);

          // Calculate summary metrics
          const totalOrders = mockOrders.length;
          const completedOrders = mockOrders.filter(o => o.status === 'Completed').length;
          const onTimeOrders = mockOrders.filter(o => o.deliveredOnTime).length;
          const totalCycleTime = mockOrders.reduce((sum, order) => {
            return sum + order.operations.reduce((opSum, op) => opSum + (op.cycleTime || 0), 0);
          }, 0);
          const totalOperations = mockOrders.reduce((sum, order) => sum + order.operations.length, 0);
          const totalDefects = mockOrders.reduce((sum, order) => sum + (order.defects || 0), 0);
          const totalFirstPass = mockOrders.reduce((sum, order) => sum + (order.firstPass || 0), 0);
          const totalProduced = mockOrders.reduce((sum, order) => sum + (order.completedQuantity || 0), 0);
          const totalTarget = mockOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);

          // Calculate operations by type
          const operationsByType = {
            cutting: mockOrders.filter(o =>
              o.operations.some(op => workstations.find(ws => ws.id === op.workstationId)?.type === 'cutting')
            ).length,
            sewing: mockOrders.filter(o =>
              o.operations.some(op => workstations.find(ws => ws.id === op.workstationId)?.type === 'sewing')
            ).length,
            embroidery: mockOrders.filter(o =>
              o.operations.some(op => workstations.find(ws => ws.id === op.workstationId)?.type === 'embroidery')
            ).length,
            laminating: mockOrders.filter(o =>
              o.operations.some(op => workstations.find(ws => ws.id === op.workstationId)?.type === 'laminating')
            ).length
          };

          // Find critical operations
          const criticalOps = mockOrders.filter(o =>
            o.priority === 'High' ||
            o.status === 'On Hold' ||
            o.operations.some(op => new Date(op.endDate) < new Date())
          );

          setCriticalOperations(criticalOps);

          setSummaryStats({
            totalOrders,
            plannedOrders: mockOrders.filter(o => o.status === 'Planned').length,
            inProgressOrders: mockOrders.filter(o => o.status === 'In Progress').length,
            completedOrders,
            onHoldOrders: mockOrders.filter(o => o.status === 'On Hold').length,
            cancelledOrders: mockOrders.filter(o => o.status === 'Cancelled').length,
            onTimeDeliveryRate: totalOrders > 0 ? (onTimeOrders / totalOrders) * 100 : 0,
            avgCycleTime: totalOperations > 0 ? totalCycleTime / totalOperations : 0,
            unitsProduced: totalProduced,
            unitsTarget: totalTarget,
            defectRate: totalProduced > 0 ? (totalDefects / totalProduced) * 100 : 0,
            firstPassYield: totalProduced > 0 ? (totalFirstPass / totalProduced) * 100 : 0,
            resourceUtilization: 78.5, // Mock value
            bottleneckOperations: mockOrders
              .flatMap(o => o.operations)
              .filter(op => op.cycleTime > 72), // Operations taking more than 72 hours
            operationsByType,
            lateOperations: mockOrders.filter(o =>
              o.operations.some(op => new Date(op.endDate) < new Date())
            ).length,
            qualityIssues: mockOrders.filter(o => o.defects > 0).length,
            resourceConflicts: mockOrders.filter(o =>
              o.operations.some(op => !op.workstationId)
            ).length
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Timeline view functions (similar to ProductionSchedulePage.js)
  const getDaysForView = () => {
    if (viewMode === 'day') return [currentDate];
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
    if (viewMode === 'month') {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return eachDayOfInterval({ start, end });
    }
    return [];
  };

  const hasOperationsOnDay = (order, day) => {
    return order.operations.some(op => {
      const startDate = new Date(op.startDate);
      const endDate = new Date(op.endDate);
      return isWithinInterval(day, { start: startDate, end: endDate }) ||
             isSameDay(day, startDate) || 
             isSameDay(day, endDate);
    });
  };

  // Status and priority color helpers
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Planned': return 'info';
      case 'Not Started': return 'default';
      case 'On Hold': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  // Prepare data for charts
  const prepareStatusData = () => {
    const statusCounts = {
      'Completed': summaryStats.completedOrders,
      'In Progress': summaryStats.inProgressOrders,
      'Planned': summaryStats.plannedOrders,
      'On Hold': summaryStats.onHoldOrders,
      'Cancelled': summaryStats.cancelledOrders
    };
    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status],
      color: getStatusColor(status)
    }));
  };

  const prepareQualityData = () => {
    return [
      { name: 'Defect Rate', value: summaryStats.defectRate, color: '#ff6384' },
      { name: 'First Pass Yield', value: summaryStats.firstPassYield, color: '#36a2eb' }
    ];
  };

  // Render components
  const renderSummaryMetrics = () => (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab label="All Operations" />
        <Tab label="Cutting" />
        <Tab label="Sewing" />
        <Tab label="Embroidery" />
        <Tab label="Laminating" />
      </Tabs>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title="Operations by Type" />
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Cutting', value: summaryStats.operationsByType.cutting, color: '#8884d8' },
                      { name: 'Sewing', value: summaryStats.operationsByType.sewing, color: '#82ca9d' },
                      { name: 'Embroidery', value: summaryStats.operationsByType.embroidery, color: '#ffc658' },
                      { name: 'Laminating', value: summaryStats.operationsByType.laminating, color: '#ff8042' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#8884d8" />
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ffc658" />
                    <Cell fill="#ff8042" />
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title="Critical Issues" />
            <CardContent>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="subtitle2">Late Operations</Typography>
                  <Typography variant="h4" color="error">
                    {summaryStats.lateOperations}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Quality Issues</Typography>
                  <Typography variant="h4" color="warning.main">
                    {summaryStats.qualityIssues}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Resource Conflicts</Typography>
                  <Typography variant="h4" color="info.main">
                    {summaryStats.resourceConflicts}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title="Production vs Target" />
            <CardContent>
              <Typography variant="h6" component="div">
                {summaryStats.unitsProduced} / {summaryStats.unitsTarget}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(summaryStats.unitsProduced / summaryStats.unitsTarget) * 100}
                sx={{ height: 10, mt: 2 }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Defect Rate</Typography>
                <Typography variant="h6" color={summaryStats.defectRate > 5 ? 'error' : 'success'}>
                  {summaryStats.defectRate.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title="Efficiency Metrics" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">On-Time Delivery</Typography>
                <Typography variant="h4">
                  {summaryStats.onTimeDeliveryRate.toFixed(1)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={summaryStats.onTimeDeliveryRate}
                  sx={{ height: 10, mt: 1 }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">First Pass Yield</Typography>
                <Typography variant="h4">
                  {summaryStats.firstPassYield.toFixed(1)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={summaryStats.firstPassYield}
                  sx={{ height: 10, mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTimelineView = () => {
    const days = getDaysForView();
    
    return (
      <Box sx={{ overflowX: 'auto' }}>
        {/* Timeline implementation similar to ProductionSchedulePage.js */}
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
                  {order.operations.filter(op => {
                    const startDate = new Date(op.startDate);
                    const endDate = new Date(op.endDate);
                    return isWithinInterval(day, { start: startDate, end: endDate }) ||
                           isSameDay(day, startDate) ||
                           isSameDay(day, endDate);
                  }).map(op => (
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

  const renderResourceUtilization = () => (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="Resource Utilization" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Team Capacity</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Team A', capacity: 100, utilized: 85 },
                  { name: 'Team B', capacity: 100, utilized: 65 },
                  { name: 'Team C', capacity: 100, utilized: 90 }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="capacity" fill="#8884d8" name="Capacity" />
                <Bar dataKey="utilized" fill="#82ca9d" name="Utilized" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Machine Utilization</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={workstations.map(ws => ({
                  name: ws.name,
                  utilization: Math.floor(Math.random() * 100)
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="utilization" fill="#ffc658" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderQualityMetrics = () => (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="Quality Metrics" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Defect Rate by Product</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Tent', defects: 2, total: 50 },
                  { name: 'Backpack', defects: 5, total: 100 },
                  { name: 'Jacket', defects: 3, total: 75 }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="defects" fill="#ff6384" name="Defects" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>First Pass Yield</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareQualityData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareQualityData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderBottleneckAnalysis = () => (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="Bottleneck Analysis" />
      <CardContent>
        <Typography variant="h6" gutterBottom>Process Step Cycle Times</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={[
              { name: 'Cutting', avgTime: 48, maxTime: 72 },
              { name: 'Sewing', avgTime: 96, maxTime: 120 },
              { name: 'Laminating', avgTime: 72, maxTime: 96 },
              { name: 'Embroidery', avgTime: 120, maxTime: 144 },
              { name: 'Quality Check', avgTime: 24, maxTime: 48 }
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="avgTime" fill="#8884d8" name="Average Time" />
            <Bar dataKey="maxTime" fill="#ff8042" name="Max Time" />
          </BarChart>
        </ResponsiveContainer>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Critical Operations</Typography>
        <List>
          {summaryStats.bottleneckOperations.map((op, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${op.name} (${op.cycleTime} hours)`}
                secondary={`Order: ${orders.find(o => o.operations.some(oOp => oOp.id === op.id))?.orderNumber || 'Unknown'}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Manufacturing Dashboard
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
                onChange={(e) => setViewMode(e.target.value)}
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={() => setCurrentDate(prev => {
              if (viewMode === 'day') return subDays(prev, 1);
              if (viewMode === 'week') return subWeeks(prev, 1);
              const newDate = new Date(prev);
              newDate.setMonth(newDate.getMonth() - 1);
              return newDate;
            })}>
              <ArrowBackIcon />
            </IconButton>
            <DatePicker
              value={currentDate}
              onChange={(newValue) => setCurrentDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" sx={{ width: 150, mx: 1 }} />}
            />
            <IconButton onClick={() => setCurrentDate(prev => {
              if (viewMode === 'day') return addDays(prev, 1);
              if (viewMode === 'week') return addWeeks(prev, 1);
              const newDate = new Date(prev);
              newDate.setMonth(newDate.getMonth() + 1);
              return newDate;
            })}>
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>

        {renderSummaryMetrics()}

        <Paper sx={{ mb: 3, p: 2 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Timeline View" />
            <Tab label="Detailed Metrics" />
          </Tabs>
          <Divider sx={{ mb: 2 }} />

          {activeTab === 0 ? renderTimelineView() : (
            <Box>
              {renderResourceUtilization()}
              {renderQualityMetrics()}
              {renderBottleneckAnalysis()}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Order Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details: {selectedOrder?.orderNumber}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedOrder.productName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Quantity: {selectedOrder.quantity} (Completed: {selectedOrder.completedQuantity})
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} size="small" />
              </Typography>
              <Typography variant="body1" gutterBottom>
                Priority: <Chip label={selectedOrder.priority} color={getPriorityColor(selectedOrder.priority)} size="small" />
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Operations
              </Typography>
              <List>
                {selectedOrder.operations.map(op => (
                  <ListItem key={op.id}>
                    <ListItemText
                      primary={`${op.name} (${op.status})`}
                      secondary={`${format(new Date(op.startDate), 'MMM d')} - ${format(new Date(op.endDate), 'MMM d')} | ${op.cycleTime} hours`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenDialog(false);
              navigate(`/manufacturing/orders/${selectedOrder?.id}`);
            }}
          >
            View Full Details
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}