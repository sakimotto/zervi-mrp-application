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
