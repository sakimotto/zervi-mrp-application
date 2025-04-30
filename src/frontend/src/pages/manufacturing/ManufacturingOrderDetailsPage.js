import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Stack,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Print as PrintIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Check as CompleteIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';
import { manufacturingOrderAPI } from '../../services/api';

export default function ManufacturingOrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call with mock data
    setLoading(true);
    setTimeout(() => {
      // Detailed mock data for a single manufacturing order
      const mockOrder = {
        id: parseInt(id),
        orderNumber: `MO-2025${id.padStart(3, '0')}`,
        productName: 'Camping Tent - 2-Person',
        productCode: 'TENT-2P-001',
        productDescription: 'Lightweight 2-person camping tent with rainfly',
        quantity: 50,
        completedQuantity: 15,
        priority: 'High',
        status: 'In Progress',
        startDate: '2025-04-15',
        dueDate: '2025-05-10',
        createdBy: 'John Smith',
        createdDate: '2025-04-01',
        assignedTo: 'Production Team A',
        notes: 'Customer requires expedited production',
        customerOrderRef: 'CO-20254001',
        
        // Progress tracking
        stages: [
          { name: 'Materials Preparation', status: 'Completed', progress: 100 },
          { name: 'Cutting', status: 'Completed', progress: 100 },
          { name: 'Sewing', status: 'In Progress', progress: 60 },
          { name: 'Quality Check', status: 'Not Started', progress: 0 },
          { name: 'Packaging', status: 'Not Started', progress: 0 }
        ],
        
        // Operations
        operations: [
          { 
            id: 1, 
            name: 'Cut Tent Fabric', 
            status: 'Completed', 
            assignedTo: 'Cutting Team', 
            equipment: 'Cutting Machine 3',
            startDate: '2025-04-16',
            endDate: '2025-04-17',
            duration: '8 hours',
            instructions: 'Use pattern template #42A for all cuts',
            completedBy: 'Mike Johnson',
            completedDate: '2025-04-17'
          },
          { 
            id: 2, 
            name: 'Sew Tent Body', 
            status: 'In Progress', 
            assignedTo: 'Sewing Team', 
            equipment: 'Industrial Sewing Stations 1-4',
            startDate: '2025-04-18',
            endDate: null,
            duration: '24 hours',
            instructions: 'Double-stitch all seams for waterproofing',
            completedBy: null,
            completedDate: null
          },
          { 
            id: 3, 
            name: 'Prepare Rainfly', 
            status: 'In Progress', 
            assignedTo: 'Sewing Team', 
            equipment: 'Industrial Sewing Stations 5-6',
            startDate: '2025-04-18',
            endDate: null,
            duration: '16 hours',
            instructions: 'Apply waterproof coating after stitching',
            completedBy: null,
            completedDate: null
          },
          { 
            id: 4, 
            name: 'Assemble Poles', 
            status: 'Not Started', 
            assignedTo: 'Assembly Team', 
            equipment: 'Assembly Stations 1-2',
            startDate: '2025-04-22',
            endDate: null,
            duration: '8 hours',
            instructions: 'Test flexibility of each pole after assembly',
            completedBy: null,
            completedDate: null
          },
          { 
            id: 5, 
            name: 'Final Assembly', 
            status: 'Not Started', 
            assignedTo: 'Assembly Team', 
            equipment: 'Main Assembly Floor',
            startDate: '2025-04-24',
            endDate: null,
            duration: '16 hours',
            instructions: 'Test setup of each completed tent',
            completedBy: null,
            completedDate: null
          }
        ],
        
        // Materials
        materials: [
          {
            id: 1,
            itemCode: 'FAB-POLY-201',
            name: 'Polyester Fabric - Green',
            required: 300,
            allocated: 300,
            consumed: 280,
            unit: 'yards',
            location: 'Warehouse A - Shelf 34'
          },
          {
            id: 2,
            itemCode: 'FAB-NYLON-103',
            name: 'Waterproof Nylon - Beige',
            required: 150,
            allocated: 150,
            consumed: 120,
            unit: 'yards',
            location: 'Warehouse A - Shelf 28'
          },
          {
            id: 3,
            itemCode: 'POLE-ALU-150',
            name: 'Aluminum Poles - 150cm',
            required: 200,
            allocated: 200,
            consumed: 0,
            unit: 'pieces',
            location: 'Warehouse B - Aisle 5'
          },
          {
            id: 4,
            itemCode: 'ZIP-HEAVY-45',
            name: 'Heavy Duty Zipper - 45cm',
            required: 100,
            allocated: 100,
            consumed: 60,
            unit: 'pieces',
            location: 'Warehouse A - Shelf 12'
          },
          {
            id: 5,
            itemCode: 'STAKE-STEEL-20',
            name: 'Steel Stakes - 20cm',
            required: 400,
            allocated: 350,
            consumed: 0,
            unit: 'pieces',
            location: 'Warehouse B - Aisle 8'
          }
        ]
      };
      
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
    
    // In real implementation, would use:
    // const fetchOrderDetails = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await manufacturingOrderAPI.getManufacturingOrderById(id);
    //     setOrder(response.data);
    //   } catch (error) {
    //     console.error('Error fetching manufacturing order details:', error);
    //     setError('Failed to load order details. Please try again later.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchOrderDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/manufacturing/orders');
  };
  
  const handleEdit = () => {
    navigate(`/manufacturing/orders/${id}/edit`);
  };
  
  const handlePrint = () => {
    console.log('Print work order', id);
    // In real implementation, this would trigger a print function
    window.print();
  };
  
  const handleStartOrder = () => {
    console.log('Start order', id);
    // In real implementation, this would update the order status
    // updateOrderStatus('In Progress');
  };
  
  const handlePauseOrder = () => {
    console.log('Pause order', id);
    // In real implementation, this would update the order status
    // updateOrderStatus('On Hold');
  };
  
  const handleCompleteOrder = () => {
    console.log('Complete order', id);
    // In real implementation, this would update the order status
    // updateOrderStatus('Completed');
  };
  
  const handleMarkOperationComplete = (operationId) => {
    console.log('Mark operation complete', operationId);
    // In real implementation, this would update the operation status
    // and refresh order data
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

  // Calculate overall completion percentage
  const calculateOverallProgress = () => {
    if (!order) return 0;
    return Math.round((order.completedQuantity / order.quantity) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          startIcon={<BackIcon />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }
  
  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Order not found</Alert>
        <Button 
          variant="contained" 
          startIcon={<BackIcon />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with back button, title and action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h5" component="h1">
            Manufacturing Order Details
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Edit Order
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print Work Order
          </Button>
          {order.status === 'Planned' && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<StartIcon />} 
              onClick={handleStartOrder}
            >
              Start Order
            </Button>
          )}
          {order.status === 'In Progress' && (
            <>
              <Button 
                variant="contained" 
                color="warning" 
                startIcon={<PauseIcon />} 
                onClick={handlePauseOrder}
                sx={{ mr: 1 }}
              >
                Pause Order
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<CompleteIcon />} 
                onClick={handleCompleteOrder}
              >
                Complete Order
              </Button>
            </>
          )}
        </Box>
      </Box>
      
      {/* Order Header Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography variant="h6" gutterBottom>
              {order.orderNumber} - {order.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {order.productDescription}
            </Typography>
            <Typography variant="body2">
              <strong>Product Code:</strong> {order.productCode}
            </Typography>
            <Typography variant="body2">
              <strong>Customer Order:</strong> {order.customerOrderRef}
            </Typography>
            <Typography variant="body2">
              <strong>Created By:</strong> {order.createdBy} on {order.createdDate}
            </Typography>
            <Typography variant="body2">
              <strong>Assigned To:</strong> {order.assignedTo}
            </Typography>
            {order.notes && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Notes:</strong> {order.notes}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)} 
                    size="small" 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Priority:</Typography>
                  <Chip 
                    label={order.priority} 
                    color={getPriorityColor(order.priority)} 
                    size="small" 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Start Date:</Typography>
                  <Typography variant="body2">{order.startDate}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Due Date:</Typography>
                  <Typography variant="body2">{order.dueDate}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Quantity:</Typography>
                  <Typography variant="body2">{order.quantity}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Completed:</Typography>
                  <Typography variant="body2">{order.completedQuantity}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Progress Tracking */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Progress Tracking
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Overall Completion:</Typography>
            <Typography variant="body2">
              {calculateOverallProgress()}% ({order.completedQuantity} of {order.quantity})
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculateOverallProgress()} 
            sx={{ height: 10, borderRadius: 1 }} 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Stage-by-Stage Progress
        </Typography>
        
        <Grid container spacing={2}>
          {order.stages.map((stage, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{stage.name}:</Typography>
                  <Chip 
                    label={stage.status} 
                    color={getStatusColor(stage.status)} 
                    size="small" 
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stage.progress} 
                  color={
                    stage.status === 'Completed' ? 'success' : 
                    stage.status === 'In Progress' ? 'primary' : 'secondary'
                  }
                  sx={{ height: 8, borderRadius: 1 }} 
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Operations Management */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Operations Management
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Operation</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Equipment</TableCell>
                <TableCell>Scheduled</TableCell>
                <TableCell>Instructions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.operations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell>{operation.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={operation.status} 
                      color={getStatusColor(operation.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{operation.assignedTo}</TableCell>
                  <TableCell>{operation.equipment}</TableCell>
                  <TableCell>
                    {operation.startDate}
                    {operation.endDate && ` - ${operation.endDate}`}
                    <br />
                    <Typography variant="caption">
                      {operation.duration}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={operation.instructions}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 150,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {operation.instructions}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {operation.status !== 'Completed' ? (
                      <Tooltip title="Mark as Complete">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleMarkOperationComplete(operation.id)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title={`Completed by ${operation.completedBy} on ${operation.completedDate}`}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Material Requirements */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Material Requirements
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Allocated</TableCell>
                <TableCell>Consumed</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>
                    <Typography variant="body2">{material.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {material.itemCode}
                    </Typography>
                  </TableCell>
                  <TableCell>{material.required} {material.unit}</TableCell>
                  <TableCell>{material.allocated} {material.unit}</TableCell>
                  <TableCell>{material.consumed} {material.unit}</TableCell>
                  <TableCell>{material.allocated - material.consumed} {material.unit}</TableCell>
                  <TableCell>{material.location}</TableCell>
                  <TableCell>
                    {material.allocated < material.required ? (
                      <Chip 
                        icon={<WarningIcon />} 
                        label="Shortage" 
                        color="error" 
                        size="small" 
                      />
                    ) : material.consumed >= material.allocated ? (
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Complete" 
                        color="success" 
                        size="small" 
                      />
                    ) : material.consumed > 0 ? (
                      <Chip 
                        icon={<AssignmentIcon />} 
                        label="In Use" 
                        color="primary" 
                        size="small" 
                      />
                    ) : (
                      <Chip 
                        label="Not Started" 
                        variant="outlined" 
                        size="small" 
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
