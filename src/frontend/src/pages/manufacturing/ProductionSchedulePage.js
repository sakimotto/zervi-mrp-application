import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Grid,
  Tooltip,
  ButtonGroup,
  Stack,
  Autocomplete,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import moment from 'moment';
import { 
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewMonth as ViewMonthIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  CalendarMonth as CalendarMonthIcon,
  Flag as FlagIcon,
  NoteAdd as NoteAddIcon,
  SimCardDownload as ExportIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Add as AddIcon
} from '@mui/icons-material';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  Resources,
  DragDropProvider,
  CurrentTimeIndicator,
  GroupingPanel,
  ViewSwitcher,
  Toolbar,
  DateNavigator,
  TodayButton,
  DayView,
  MonthView,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState, GroupingState, EditingState, IntegratedGrouping, IntegratedEditing } from '@devexpress/dx-react-scheduler';

// Mock Data for Manufacturing Orders
const mockOrders = [
  {
    id: 1,
    mo_number: 'MO-2025001',
    item_code: 'CT-2P-2025',
    item_name: 'Camping Tent - 2-Person',
    quantity: 50,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    planned_start: new Date(2025, 3, 15, 8, 0),
    planned_end: new Date(2025, 4, 10, 17, 0),
    work_center_id: 1,
    division_code: 'CAMP',
    completed_quantity: 15,
    assigned_team: 'Production Team A',
    bom_version: '1.2',
    revision: 3,
    progress: 30
  },
  { 
    id: 2, 
    title: 'MO-2025002: Hiking Backpack - 40L', 
    productName: 'Hiking Backpack - 40L',
    orderNumber: 'MO-2025002',
    quantity: 100, 
    priority: 'Medium', 
    status: 'Planned', 
    start: new Date(2025, 3, 20, 8, 0), // April 20, 2025 8:00 AM
    end: new Date(2025, 4, 15, 17, 0),  // May 15, 2025 5:00 PM
    resourceId: 2, // Production Team B
    division: 'Camping',
    completedQuantity: 0,
    assignedTo: 'Production Team B',
    color: '#3F51B5',
    progress: 0
  },
  { 
    id: 3, 
    title: 'MO-2025003: Waterproof Jacket - Large', 
    productName: 'Waterproof Jacket - Large',
    orderNumber: 'MO-2025003',
    quantity: 75, 
    priority: 'Medium', 
    status: 'In Progress', 
    start: new Date(2025, 3, 10, 8, 0), // April 10, 2025 8:00 AM
    end: new Date(2025, 4, 5, 17, 0),   // May 5, 2025 5:00 PM
    resourceId: 1, // Production Team A
    division: 'Apparel',
    completedQuantity: 40,
    assignedTo: 'Production Team A',
    color: '#4CAF50',
    progress: 53
  },
  { 
    id: 4, 
    title: 'MO-2025004: Sleeping Bag - Winter', 
    productName: 'Sleeping Bag - Winter',
    orderNumber: 'MO-2025004',
    quantity: 30, 
    priority: 'Low', 
    status: 'Completed', 
    start: new Date(2025, 3, 5, 8, 0),  // April 5, 2025 8:00 AM
    end: new Date(2025, 3, 25, 17, 0),  // April 25, 2025 5:00 PM
    resourceId: 3, // Production Team C
    division: 'Camping',
    completedQuantity: 30,
    assignedTo: 'Production Team C',
    color: '#9C27B0',
    progress: 100
  },
  { 
    id: 5, 
    title: 'MO-2025005: Camping Chair', 
    productName: 'Camping Chair',
    orderNumber: 'MO-2025005',
    quantity: 120, 
    priority: 'High', 
    status: 'Planned', 
    start: new Date(2025, 3, 25, 8, 0), // April 25, 2025 8:00 AM
    end: new Date(2025, 4, 20, 17, 0),  // May 20, 2025 5:00 PM
    resourceId: 4, // Production Team D
    division: 'Camping',
    completedQuantity: 0,
    assignedTo: 'Production Team D',
    color: '#FF9800',
    progress: 0
  },
  { 
    id: 6, 
    title: 'MO-2025006: Trekking Poles - Adjustable', 
    productName: 'Trekking Poles - Adjustable',
    orderNumber: 'MO-2025006',
    quantity: 60, 
    priority: 'Medium', 
    status: 'On Hold', 
    start: new Date(2025, 3, 12, 8, 0), // April 12, 2025 8:00 AM
    end: new Date(2025, 4, 10, 17, 0),  // May 10, 2025 5:00 PM
    resourceId: 2, // Production Team B
    division: 'Camping',
    completedQuantity: 0,
    assignedTo: 'Production Team B',
    color: '#795548',
    progress: 0
  }
];

// Mock data for operations
const mockOperations = [
  {
    id: 101,
    title: 'Cut Tent Fabric (MO-2025001)',
    orderNumber: 'MO-2025001',
    operationName: 'Cut Tent Fabric',
    startDate: new Date(2025, 3, 16, 8, 0),  // April 16, 2025 8:00 AM
    endDate: new Date(2025, 3, 17, 16, 0),   // April 17, 2025 4:00 PM
    resourceId: 11, // Cutting Machine 3
    status: 'Completed',
    assignedTo: 'Cutting Team',
    progress: 100,
    dependencies: []
  },
  {
    id: 102,
    title: 'Sew Tent Body (MO-2025001)',
    orderNumber: 'MO-2025001',
    operationName: 'Sew Tent Body',
    startDate: new Date(2025, 3, 18, 8, 0),  // April 18, 2025 8:00 AM
    endDate: new Date(2025, 3, 21, 16, 0),   // April 21, 2025 4:00 PM
    resourceId: 12, // Sewing Station 1
    status: 'In Progress',
    assignedTo: 'Sewing Team',
    progress: 60,
    dependencies: [101]
  },
  {
    id: 103,
    title: 'Prepare Rainfly (MO-2025001)',
    orderNumber: 'MO-2025001',
    operationName: 'Prepare Rainfly',
    startDate: new Date(2025, 3, 18, 8, 0),  // April 18, 2025 8:00 AM
    endDate: new Date(2025, 3, 19, 16, 0),   // April 19, 2025 4:00 PM
    resourceId: 13, // Sewing Station 5
    status: 'In Progress',
    assignedTo: 'Sewing Team',
    progress: 70,
    dependencies: [101]
  },
  {
    id: 104,
    title: 'Assemble Poles (MO-2025001)',
    orderNumber: 'MO-2025001',
    operationName: 'Assemble Poles',
    startDate: new Date(2025, 3, 22, 8, 0),  // April 22, 2025 8:00 AM
    endDate: new Date(2025, 3, 22, 16, 0),   // April 22, 2025 4:00 PM
    resourceId: 14, // Assembly Station 1
    status: 'Not Started',
    assignedTo: 'Assembly Team',
    progress: 0,
    dependencies: []
  },
  {
    id: 105,
    title: 'Final Assembly (MO-2025001)',
    orderNumber: 'MO-2025001',
    operationName: 'Final Assembly',
    startDate: new Date(2025, 3, 24, 8, 0),  // April 24, 2025 8:00 AM
    endDate: new Date(2025, 3, 25, 16, 0),   // April 25, 2025 4:00 PM
    resourceId: 15, // Main Assembly Floor
    status: 'Not Started',
    assignedTo: 'Assembly Team',
    progress: 0,
    dependencies: [102, 103, 104]
  },
  {
    id: 201,
    title: 'Cut Backpack Materials (MO-2025002)',
    orderNumber: 'MO-2025002',
    operationName: 'Cut Backpack Materials',
    startDate: new Date(2025, 3, 20, 8, 0),  // April 20, 2025 8:00 AM
    endDate: new Date(2025, 3, 21, 16, 0),   // April 21, 2025 4:00 PM
    resourceId: 11, // Cutting Machine 3
    status: 'Planned',
    assignedTo: 'Cutting Team',
    progress: 0,
    dependencies: []
  },
  {
    id: 202,
    title: 'Sew Backpack Compartments (MO-2025002)',
    orderNumber: 'MO-2025002',
    operationName: 'Sew Backpack Compartments',
    startDate: new Date(2025, 3, 22, 8, 0),  // April 22, 2025 8:00 AM
    endDate: new Date(2025, 3, 24, 16, 0),   // April 24, 2025 4:00 PM
    resourceId: 12, // Sewing Station 1
    status: 'Planned',
    assignedTo: 'Sewing Team',
    progress: 0,
    dependencies: [201]
  }
];

// Resource definitions
const productionResources = [
  { id: 1, text: 'Production Team A', color: '#FF5722' },
  { id: 2, text: 'Production Team B', color: '#3F51B5' },
  { id: 3, text: 'Production Team C', color: '#9C27B0' },
  { id: 4, text: 'Production Team D', color: '#FF9800' },
  { id: 5, text: 'Production Team E', color: '#4CAF50' },
];

const equipmentResources = [
  { id: 11, text: 'Cutting Machine 3', color: '#E91E63' },
  { id: 12, text: 'Sewing Station 1', color: '#2196F3' },
  { id: 13, text: 'Sewing Station 5', color: '#00BCD4' },
  { id: 14, text: 'Assembly Station 1', color: '#8BC34A' },
  { id: 15, text: 'Main Assembly Floor', color: '#FFC107' },
  { id: 16, text: 'Quality Check Area', color: '#607D8B' },
];

// Combined resource list for the Resource Allocation view
const allResources = [
  { id: 1, name: 'Production Team A', type: 'Team', capacity: 50, currentLoad: 35, overAllocated: false },
  { id: 2, name: 'Production Team B', type: 'Team', capacity: 40, currentLoad: 30, overAllocated: false },
  { id: 3, name: 'Production Team C', type: 'Team', capacity: 45, currentLoad: 25, overAllocated: false },
  { id: 4, name: 'Production Team D', type: 'Team', capacity: 50, currentLoad: 55, overAllocated: true },
  { id: 5, name: 'Production Team E', type: 'Team', capacity: 35, currentLoad: 20, overAllocated: false },
  { id: 11, name: 'Cutting Machine 3', type: 'Equipment', capacity: 16, currentLoad: 14, overAllocated: false },
  { id: 12, name: 'Sewing Station 1', type: 'Equipment', capacity: 16, currentLoad: 12, overAllocated: false },
  { id: 13, name: 'Sewing Station 5', type: 'Equipment', capacity: 16, currentLoad: 18, overAllocated: true },
  { id: 14, name: 'Assembly Station 1', type: 'Equipment', capacity: 16, currentLoad: 8, overAllocated: false },
  { id: 15, name: 'Main Assembly Floor', type: 'Equipment', capacity: 24, currentLoad: 16, overAllocated: false },
  { id: 16, name: 'Quality Check Area', type: 'Equipment', capacity: 16, currentLoad: 10, overAllocated: false },
];

// Status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'primary';
    case 'PLANNED':
      return 'info';
    case 'NOT_STARTED':
      return 'default';
    case 'ON_HOLD':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

// Priority colors
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

// Custom Calendar Event Component
const CalendarEvent = ({ event }) => {
  return (
    <div style={{ 
      overflow: 'hidden',
      textOverflow: 'ellipsis', 
      whiteSpace: 'nowrap', 
      height: '100%',
      backgroundColor: event.status === 'Completed' ? '#4CAF50' : 
                       event.status === 'In Progress' ? '#2196F3' : 
                       event.status === 'On Hold' ? '#FFC107' : 
                       event.status === 'Planned' ? '#9E9E9E' : '#F44336',
      color: 'white',
      padding: '2px 4px',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ fontWeight: 'bold' }}>{event.orderNumber}</div>
      <div>{event.productName}</div>
      <div>Progress: {event.progress}%</div>
    </div>
  );
};

// Custom Appointment Component for the Scheduler
const Appointment = ({ data, ...restProps }) => {
  return (
    <Appointments.Appointment
      {...restProps}
      data={data}
      style={{
        backgroundColor: data.status === 'Completed' ? '#4CAF50' : 
                        data.status === 'In Progress' ? '#2196F3' : 
                        data.status === 'On Hold' ? '#FFC107' : 
                        data.status === 'Planned' ? '#9E9E9E' : '#F44336',
        color: 'white',
        borderRadius: '4px',
      }}
    >
      <div style={{ padding: '2px 4px' }}>
        <div style={{ fontWeight: 'bold' }}>{data.operationName}</div>
        <div>{data.orderNumber}</div>
        <div>{data.progress}% Complete</div>
      </div>
    </Appointments.Appointment>
  );
};

// Custom tooltip content for the Scheduler
const Content = ({ appointmentData, ...restProps }) => {
  return (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography variant="subtitle2">Status:</Typography>
        </Grid>
        <Grid item xs={10}>
          <Chip 
            label={appointmentData.status} 
            color={getStatusColor(appointmentData.status)} 
            size="small" 
          />
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">Assigned:</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="body2">{appointmentData.assignedTo}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">Progress:</Typography>
        </Grid>
        <Grid item xs={10}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={appointmentData.progress} />
            </Box>
            <Typography variant="body2">{appointmentData.progress}%</Typography>
          </Box>
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  );
};

// Drag and Drop Context for Resource Allocation
const DraggableOperation = ({ operation, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'operation',
    item: { operation },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
          <Typography variant="subtitle2">{operation.operationName}</Typography>
          <Typography variant="caption" display="block">{operation.orderNumber}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Chip 
              label={operation.status} 
              color={getStatusColor(operation.status)} 
              size="small" 
            />
            <Typography variant="caption">{moment(operation.startDate).format('MMM D')} - {moment(operation.endDate).format('MMM D')}</Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

const DropTarget = ({ resourceId, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'operation',
    drop: (item) => onDrop(item.operation, resourceId),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        minHeight: '50px',
        padding: '8px',
        borderRadius: '4px',
      }}
    >
      {children}
    </div>
  );
};

// Main Production Schedule Page Component
// Main component definition
// Component definition
function ProductionSchedulePage({
  orders,
  operations,
  resources,
  onScheduleUpdate,
  onOperationDrag
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [calendarView, setCalendarView] = useState('month');
  const [events, setEvents] = useState(mockOrders);
  const [localOperations, setLocalOperations] = useState(operations);
  const [localResources, setLocalResources] = useState(resources);

  useEffect(() => {
    if (orders) {
      setEvents(orders.map(order => ({
        ...order,
        title: `${order.mo_number}: ${order.item_name}`,
        start: order.planned_start,
        end: order.planned_end
      })));
    }
    
    // Define PropTypes after the component
    ProductionSchedulePage.propTypes = {
      orders: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          mo_number: PropTypes.string.isRequired,
          item_code: PropTypes.string.isRequired,
          item_name: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          priority: PropTypes.oneOf(['HIGH', 'MEDIUM', 'LOW']).isRequired,
          status: PropTypes.oneOf([
            'PLANNED',
            'IN_PROGRESS',
            'COMPLETED',
            'ON_HOLD',
            'CANCELLED'
          ]).isRequired,
          planned_start: PropTypes.instanceOf(Date).isRequired,
          planned_end: PropTypes.instanceOf(Date).isRequired,
          work_center_id: PropTypes.number.isRequired,
          division_code: PropTypes.string.isRequired,
          completed_quantity: PropTypes.number.isRequired,
          bom_version: PropTypes.string.isRequired,
          revision: PropTypes.number.isRequired
        })
      ).isRequired,
      operations: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          operation_name: PropTypes.string.isRequired,
          mo_number: PropTypes.string.isRequired,
          start_date: PropTypes.instanceOf(Date).isRequired,
          end_date: PropTypes.instanceOf(Date).isRequired,
          status: PropTypes.string.isRequired,
          progress: PropTypes.number.isRequired
        })
      ).isRequired,
      resources: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['TEAM', 'EQUIPMENT']).isRequired,
          capacity: PropTypes.number.isRequired,
          currentLoad: PropTypes.number.isRequired
        })
      ).isRequired,
      onScheduleUpdate: PropTypes.func.isRequired,
      onOperationDrag: PropTypes.func.isRequired
    };
    
    ProductionSchedulePage.propTypes = {
      orders: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          mo_number: PropTypes.string.isRequired,
          item_code: PropTypes.string.isRequired,
          item_name: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          priority: PropTypes.oneOf(['HIGH', 'MEDIUM', 'LOW']).isRequired,
          status: PropTypes.oneOf([
            'PLANNED',
            'IN_PROGRESS',
            'COMPLETED',
            'ON_HOLD',
            'CANCELLED'
          ]).isRequired,
          planned_start: PropTypes.instanceOf(Date).isRequired,
          planned_end: PropTypes.instanceOf(Date).isRequired,
          work_center_id: PropTypes.number.isRequired,
          division_code: PropTypes.string.isRequired,
          completed_quantity: PropTypes.number.isRequired,
          bom_version: PropTypes.string.isRequired,
          revision: PropTypes.number.isRequired
        })
      ).isRequired,
      operations: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          operation_name: PropTypes.string.isRequired,
          mo_number: PropTypes.string.isRequired,
          start_date: PropTypes.instanceOf(Date).isRequired,
          end_date: PropTypes.instanceOf(Date).isRequired,
          status: PropTypes.string.isRequired,
          progress: PropTypes.number.isRequired
        })
      ).isRequired,
      resources: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['TEAM', 'EQUIPMENT']).isRequired,
          capacity: PropTypes.number.isRequired,
          currentLoad: PropTypes.number.isRequired
        })
      ).isRequired,
      onScheduleUpdate: PropTypes.func.isRequired,
      onOperationDrag: PropTypes.func.isRequired
    };
    
        // Update events when orders change
    
        // Update events when orders change
      }, [orders]);
  const [quickViewFilter, setQuickViewFilter] = useState('all');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // React-Big-Calendar localizer
  const localizer = momentLocalizer(moment);

  // Filter events based on filters
  useEffect(() => {
    let filteredEvents = [...mockOrders];
    let filteredOperations = [...mockOperations];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.status === statusFilter);
      filteredOperations = filteredOperations.filter(op => op.status === statusFilter);
    };
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.priority === priorityFilter);
    };
    
    // Apply division filter
    if (divisionFilter !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.division === divisionFilter);
    };
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(
        event => 
          event.orderNumber.toLowerCase().includes(searchLower) ||
          event.productName.toLowerCase().includes(searchLower) ||
          event.assignedTo.toLowerCase().includes(searchLower)
      );
      filteredOperations = filteredOperations.filter(
        op => 
          op.orderNumber.toLowerCase().includes(searchLower) ||
          op.operationName.toLowerCase().includes(searchLower) ||
          op.assignedTo.toLowerCase().includes(searchLower)
      );
    };
    
    // Update filtered events
    setEvents(filteredEvents);
    setLocalOperations(filteredOperations);
  }, [searchTerm, statusFilter, priorityFilter, divisionFilter, resourceTypeFilter, quickViewFilter]);
  
  // Rest of component implementation...
  
  // Return component JSX
  return (
    <Box sx={{ p: 2 }}>
      {/* Component rendering logic */}
    </Box>
  );
}

// PropTypes declaration
ProductionSchedulePage.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      mo_number: PropTypes.string.isRequired,
      item_code: PropTypes.string.isRequired,
      item_name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      priority: PropTypes.oneOf(['HIGH', 'MEDIUM', 'LOW']).isRequired,
      status: PropTypes.oneOf([
        'PLANNED',
        'IN_PROGRESS',
        'COMPLETED',
        'ON_HOLD',
        'CANCELLED'
      ]).isRequired,
      planned_start: PropTypes.instanceOf(Date).isRequired,
      planned_end: PropTypes.instanceOf(Date).isRequired,
      work_center_id: PropTypes.number.isRequired,
      division_code: PropTypes.string.isRequired,
      completed_quantity: PropTypes.number.isRequired,
      bom_version: PropTypes.string.isRequired,
      revision: PropTypes.number.isRequired
    })
  ).isRequired,
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      operation_name: PropTypes.string.isRequired,
      mo_number: PropTypes.string.isRequired,
      start_date: PropTypes.instanceOf(Date).isRequired,
      end_date: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired
    })
  ).isRequired,
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['TEAM', 'EQUIPMENT']).isRequired,
      capacity: PropTypes.number.isRequired,
      currentLoad: PropTypes.number.isRequired
    })
  ).isRequired,
  onScheduleUpdate: PropTypes.func.isRequired,
  onOperationDrag: PropTypes.func.isRequired
};

// PropTypes declaration
ProductionSchedulePage.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      mo_number: PropTypes.string.isRequired,
          completed_quantity: PropTypes.number.isRequired,
          bom_version: PropTypes.string.isRequired,
          revision: PropTypes.number.isRequired
        })
      ).isRequired,
      operations: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          operation_name: PropTypes.string.isRequired,
          mo_number: PropTypes.string.isRequired,
          start_date: PropTypes.instanceOf(Date).isRequired,
          end_date: PropTypes.instanceOf(Date).isRequired,
          status: PropTypes.string.isRequired,
          progress: PropTypes.number.isRequired
        })
      ).isRequired,
      resources: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['TEAM', 'EQUIPMENT']).isRequired,
          capacity: PropTypes.number.isRequired,
          currentLoad: PropTypes.number.isRequired
        })
      ).isRequired,
      onScheduleUpdate: PropTypes.func.isRequired,
      onOperationDrag: PropTypes.func.isRequired
    };
    
    // Apply quick view filter
    if (quickViewFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filteredEvents = filteredEvents.filter(
        event =>
          (event.start <= today && event.end >= today) || // Spans today
          (event.start >= today && event.start < tomorrow) // Starts today
      );
      
      filteredOperations = filteredOperations.filter(
        op => 
          (op.startDate <= today && op.endDate >= today) || // Spans today
          (op.startDate >= today && op.startDate < tomorrow) // Starts today
      );
    } else if (quickViewFilter === 'thisWeek') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7); // End of week
      
      filteredEvents = filteredEvents.filter(
        event => 
          (event.start >= startOfWeek && event.start < endOfWeek) || // Starts this week
          (event.end >= startOfWeek && event.end < endOfWeek) || // Ends this week
          (event.start <= startOfWeek && event.end >= endOfWeek) // Spans this week
      );
      
      filteredOperations = filteredOperations.filter(
        op => 
          (op.startDate >= startOfWeek && op.startDate < endOfWeek) || // Starts this week
          (op.endDate >= startOfWeek && op.endDate < endOfWeek) || // Ends this week
          (op.startDate <= startOfWeek && op.endDate >= endOfWeek) // Spans this week
      );
    } else if (quickViewFilter === 'thisMonth') {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      filteredEvents = filteredEvents.filter(
        event => 
          (event.start >= startOfMonth && event.start <= endOfMonth) || // Starts this month
          (event.end >= startOfMonth && event.end <= endOfMonth) || // Ends this month
          (event.start <= startOfMonth && event.end >= endOfMonth) // Spans this month
      );
      
      filteredOperations = filteredOperations.filter(
        op => 
          (op.startDate >= startOfMonth && op.startDate <= endOfMonth) || // Starts this month
          (op.endDate >= startOfMonth && op.endDate <= endOfMonth) || // Ends this month
          (op.startDate <= startOfMonth && op.endDate >= endOfMonth) // Spans this month
      );
    }
    
    // Apply resource type filter for resources
    let filteredResources = [...allResources];
    if (resourceTypeFilter !== 'all') {
      filteredResources = filteredResources.filter(
        resource => resource.type === resourceTypeFilter
      );
    }
    
    setEvents(filteredEvents);
    setLocalOperations(filteredOperations);
    setLocalResources(filteredResources);
  }, [searchTerm, statusFilter, priorityFilter, divisionFilter, resourceTypeFilter, quickViewFilter]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Toggle filters display
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle calendar view change
  const handleViewChange = (view) => {
    setCalendarView(view);
  };

  // Handle refresh click
  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh with a delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Handle quick view filter change
  const handleQuickViewFilter = (filter) => {
    setQuickViewFilter(filter);
  };

  // Handle drag and drop for resource allocation
  const handleOperationDrop = (operation, newResourceId) => {
    // Clone operations array
    const updatedOperations = operations.map(op => {
      if (op.id === operation.id) {
        return { ...op, resourceId: newResourceId };
      }
      return op;
    });
    setLocalOperations(updatedOperations);
    
    // In a real app, you would update the database here
  };

  // Handle note dialog
  const handleNoteOpen = (event) => {
    setSelectedEvent(event);
    setNoteDialogOpen(true);
  };

  const handleNoteClose = () => {
    setNoteDialogOpen(false);
    setNoteText('');
    setSelectedEvent(null);
  };

  const handleNoteSubmit = () => {
    // In a real app, you would update the event with the note
    console.log(`Added note to ${selectedEvent.orderNumber}: ${noteText}`);
    handleNoteClose();
  };

  // Handle exporting the schedule
  const handleExportSchedule = () => {
    // In a real app, this would trigger a download of schedule data
    console.log('Exporting production schedule...');
  };

  // Render calendar view
  const renderCalendar = () => {
    return (
      <Box sx={{ height: 700, mt: 2 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          resourceIdAccessor="resourceId"
          resources={productionResources}
          resourceTitleAccessor="text"
          views={{ month: true, week: true, day: true }}
          view={calendarView}
          onView={handleViewChange}
          date={currentDate}
          onNavigate={date => setCurrentDate(date)}
          components={{
            event: CalendarEvent
          }}
          eventPropGetter={(event) => {
            return {
              className: `priority-${event.priority.toLowerCase()} status-${event.status.toLowerCase().replace(' ', '-')}`
            };
          }}
          popup
          selectable
          resizable
        />
      </Box>
    );
  };

  // Render resource allocation view
  const renderResourceAllocation = () => {
    // Group operations by resource
    const operationsByResource = {};
    resources.forEach(resource => {
      operationsByResource[resource.id] = operations.filter(op => op.resourceId === resource.id);
    });

    return (
      <DndProvider backend={HTML5Backend}>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {resources.map(resource => (
              <Grid item xs={12} md={6} key={resource.id}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    border: resource.overAllocated ? '2px solid #f44336' : 'none',
                    backgroundColor: resource.overAllocated ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{resource.name}</Typography>
                    <Chip 
                      label={resource.type} 
                      color={resource.type === 'Team' ? 'primary' : 'secondary'} 
                      size="small" 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Utilization:</Typography>
                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(resource.currentLoad / resource.capacity) * 100} 
                        color={resource.overAllocated ? 'error' : 'primary'}
                      />
                    </Box>
                    <Typography variant="body2">{resource.currentLoad} / {resource.capacity} hours</Typography>
                  </Box>
                  
                  {resource.overAllocated && (
                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                      This resource is over-allocated! Consider redistributing workload.
                    </Typography>
                  )}
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>Assigned Operations</Typography>
                  
                  <DropTarget resourceId={resource.id} onDrop={handleOperationDrop}>
                    {operationsByResource[resource.id] && operationsByResource[resource.id].length > 0 ? (
                      operationsByResource[resource.id].map(operation => (
                        <DraggableOperation 
                          key={operation.id} 
                          operation={operation} 
                          onDrop={handleOperationDrop} 
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        No operations assigned
                      </Typography>
                    )}
                  </DropTarget>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DndProvider>
    );
  };

  // Render Gantt chart / timeline view
  const renderTimelineView = () => {
    return (
      <Box sx={{ height: 700, mt: 2 }}>
        <Paper>
          <Scheduler data={operations} height={650}>
            <ViewState 
              currentDate={currentDate}
              onCurrentDateChange={date => setCurrentDate(date)}
              currentViewName="Week"
            />
            <GroupingState
              grouping={[{ resourceName: 'resourceId' }]}
            />
            <DayView startDayHour={8} endDayHour={18} />
            <WeekView startDayHour={8} endDayHour={18} />
            <MonthView />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <Appointments appointmentComponent={Appointment} />
            <Resources
              data={equipmentResources}
              mainResourceName="resourceId"
            />
            <IntegratedGrouping />
            <AppointmentTooltip
              contentComponent={Content}
              showCloseButton
            />
            <DragDropProvider />
            <CurrentTimeIndicator
              shadePreviousAppointments
            />
            <GroupingPanel />
          </Scheduler>
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Production Schedule
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExportSchedule}
            sx={{ mr: 1 }}
          >
            Export Schedule
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { /* Navigate to create manufacturing order page */ }}
          >
            Add Manufacturing Order
          </Button>
        </Box>
      </Box>

      {/* Filters and Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
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

        {/* Quick Filters */}
        <Box sx={{ mb: showFilters ? 2 : 0 }}>
          <ButtonGroup variant="outlined" size="small">
            <Button 
              startIcon={<TodayIcon />}
              onClick={() => handleQuickViewFilter('today')}
              variant={quickViewFilter === 'today' ? 'contained' : 'outlined'}
            >
              Today
            </Button>
            <Button 
              startIcon={<DateRangeIcon />}
              onClick={() => handleQuickViewFilter('thisWeek')}
              variant={quickViewFilter === 'thisWeek' ? 'contained' : 'outlined'}
            >
              This Week
            </Button>
            <Button 
              startIcon={<CalendarMonthIcon />}
              onClick={() => handleQuickViewFilter('thisMonth')}
              variant={quickViewFilter === 'thisMonth' ? 'contained' : 'outlined'}
            >
              This Month
            </Button>
            <Button 
              onClick={() => handleQuickViewFilter('all')}
              variant={quickViewFilter === 'all' ? 'contained' : 'outlined'}
            >
              All
            </Button>
          </ButtonGroup>

          <ButtonGroup variant="outlined" size="small" sx={{ ml: 2 }}>
            <Tooltip title="Add Note">
              <Button 
                startIcon={<NoteAddIcon />}
                onClick={() => handleNoteOpen(events[0])} // Just for demo purposes
              >
                Add Note
              </Button>
            </Tooltip>
            <Tooltip title="Add Flag">
              <Button 
                startIcon={<FlagIcon />}
              >
                Flag
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>

        {/* Advanced Filters */}
        {showFilters && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Division</InputLabel>
                <Select
                  value={divisionFilter}
                  label="Division"
                  onChange={(e) => setDivisionFilter(e.target.value)}
                >
                  <MenuItem value="all">All Divisions</MenuItem>
                  <MenuItem value="Camping">Camping</MenuItem>
                  <MenuItem value="Apparel">Apparel</MenuItem>
                  <MenuItem value="Automotive">Automotive</MenuItem>
                  <MenuItem value="Zervitek">Zervitek</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Resource Type</InputLabel>
                <Select
                  value={resourceTypeFilter}
                  label="Resource Type"
                  onChange={(e) => setResourceTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Resources</MenuItem>
                  <MenuItem value="Team">Teams</MenuItem>
                  <MenuItem value="Equipment">Equipment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Tabs for different views */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Calendar View" />
        <Tab label="Resource Allocation" />
        <Tab label="Timeline View" />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box role="tabpanel">
          {/* Calendar View options */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <ButtonGroup variant="outlined" size="small">
              <Button 
                startIcon={<ViewDayIcon />}
                onClick={() => handleViewChange('day')}
                variant={calendarView === 'day' ? 'contained' : 'outlined'}
              >
                Day
              </Button>
              <Button 
                startIcon={<ViewWeekIcon />}
                onClick={() => handleViewChange('week')}
                variant={calendarView === 'week' ? 'contained' : 'outlined'}
              >
                Week
              </Button>
              <Button 
                startIcon={<ViewMonthIcon />}
                onClick={() => handleViewChange('month')}
                variant={calendarView === 'month' ? 'contained' : 'outlined'}
              >
                Month
              </Button>
            </ButtonGroup>
          </Box>
          {renderCalendar()}
        </Box>
      )}

      {activeTab === 1 && (
        <Box role="tabpanel">
          {renderResourceAllocation()}
        </Box>
      )}

      {activeTab === 2 && (
        <Box role="tabpanel">
          {renderTimelineView()}
        </Box>
      )}

      {/* Add Note Dialog */}
      <Dialog open={noteDialogOpen} onClose={handleNoteClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Note
          {selectedEvent && (
            <Typography variant="subtitle2" color="text.secondary">
              {selectedEvent.orderNumber}: {selectedEvent.productName}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <OutlinedInput
            fullWidth
            multiline
            rows={4}
            placeholder="Enter your note here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <NoteAddIcon />
              </InputAdornment>
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoteClose} startIcon={<CloseIcon />}>Cancel</Button>
          <Button onClick={handleNoteSubmit} variant="contained" startIcon={<SaveIcon />}>Save Note</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
