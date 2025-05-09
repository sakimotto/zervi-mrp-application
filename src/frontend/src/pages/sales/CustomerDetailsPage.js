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
  CircularProgress,
  Alert,
  TextField,
  Tabs,
  Tab,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Edit as EditIcon,
  Print as PrintIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  NoteAdd as NoteIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { customerAPI } from '../../services/api';

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Simulate API call with mock data
    setLoading(true);
    setTimeout(() => {
      // Detailed mock data for a single customer
      const mockCustomer = {
        id: parseInt(id),
        customerId: `CUST-2025${id.padStart(3, '0')}`,
        name: 'Adventure Gear Co.',
        type: 'Retail',
        status: 'Active',
        email: 'contact@adventuregear.com',
        phone: '+1 (555) 123-4567',
        address: '123 Outdoor Way, Denver, CO 80202',
        website: 'www.adventuregear.com',
        taxId: '45-1234567',
        creditLimit: 10000.00,
        paymentTerms: 'Net 30',
        contactPerson: 'John Smith',
        notes: 'Primary customer for camping equipment',
        createdDate: '2025-01-15',
        lastOrderDate: '2025-04-28',
        totalOrders: 15,
        totalSpend: 12500.00,
        
        // Contacts
        contacts: [
          {
            id: 1,
            name: 'John Smith',
            position: 'Purchasing Manager',
            email: 'john@adventuregear.com',
            phone: '+1 (555) 123-4567 ext. 101',
            isPrimary: true,
            notes: 'Prefers email communication'
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            position: 'Accounts Payable',
            email: 'sarah@adventuregear.com',
            phone: '+1 (555) 123-4567 ext. 102',
            isPrimary: false,
            notes: 'Handles all billing inquiries'
          },
          {
            id: 3,
            name: 'Mike Davis',
            position: 'Warehouse Manager',
            email: 'mike@adventuregear.com',
            phone: '+1 (555) 123-4567 ext. 103',
            isPrimary: false,
            notes: 'Coordinates shipping and receiving'
          }
        ],
        
        // Recent Orders
        recentOrders: [
          {
            id: 1,
            orderNumber: 'SO-2025001',
            date: '2025-04-28',
            status: 'Shipped',
            total: 1250.00,
            items: 5,
            trackingNumber: 'UPS123456789'
          },
          {
            id: 2,
            orderNumber: 'SO-2025002',
            date: '2025-04-15',
            status: 'Completed',
            total: 850.00,
            items: 3,
            trackingNumber: 'FEDEX987654321'
          },
          {
            id: 3,
            orderNumber: 'SO-2025003',
            date: '2025-03-22',
            status: 'Completed',
            total: 2100.00,
            items: 8,
            trackingNumber: 'UPS987654321'
          }
        ],
        
        // Activity
        activity: [
          {
            id: 1,
            date: '2025-04-28',
            type: 'Order',
            description: 'Order #SO-2025001 placed',
            user: 'System'
          },
          {
            id: 2,
            date: '2025-04-25',
            type: 'Note',
            description: 'Customer requested expedited shipping on next order',
            user: 'Jane Doe'
          },
          {
            id: 3,
            date: '2025-04-20',
            type: 'Call',
            description: 'Follow-up on pending order',
            user: 'John Smith'
          },
          {
            id: 4,
            date: '2025-04-15',
            type: 'Order',
            description: 'Order #SO-2025002 completed',
            user: 'System'
          }
        ]
      };
      
      setCustomer(mockCustomer);
      setLoading(false);
    }, 1000);

    // In real implementation, would use:
    // const fetchCustomerDetails = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await customerAPI.getCustomerById(id);
    //     setCustomer(response.data);
    //   } catch (error) {
    //     console.error('Error fetching customer details:', error);
    //     setError('Failed to load customer details. Please try again later.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchCustomerDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/sales/customers');
  };
  
  const handleEdit = () => {
    navigate(`/sales/customers/${id}/edit`);
  };
  
  const handlePrint = () => {
    console.log('Print customer details', id);
    window.print();
  };
  
  const handleAddContact = () => {
    console.log('Add new contact');
    // In real implementation, this would open a contact form
  };
  
  const handleDeleteContact = (contactId) => {
    console.log('Delete contact', contactId);
    // In real implementation, this would delete the contact
  };
  
  const handleViewOrder = (orderId) => {
    navigate(`/sales/orders/${orderId}`);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'Prospect':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'Retail':
        return 'primary';
      case 'Wholesale':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Get order status color
  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Shipped':
        return 'info';
      case 'Processing':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
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
          Back to Customers
        </Button>
      </Box>
    );
  }
  
  if (!customer) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Customer not found</Alert>
        <Button 
          variant="contained" 
          startIcon={<BackIcon />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Customers
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
            Customer Details
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Edit Customer
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            onClick={handlePrint}
          >
            Print Details
          </Button>
        </Box>
      </Box>
      
      {/* Customer Header Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography variant="h6" gutterBottom>
              {customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {customer.customerId}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip 
                label={customer.type} 
                color={getTypeColor(customer.type)} 
                size="small" 
              />
              <Chip 
                label={customer.status} 
                color={getStatusColor(customer.status)} 
                size="small" 
              />
            </Stack>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                    {customer.email}
                  </Box>
                </Typography>
                <Typography variant="body2">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                    {customer.phone}
                  </Box>
                </Typography>
                <Typography variant="body2">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                    {customer.address}
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                    {customer.website}
                  </Box>
                </Typography>
                <Typography variant="body2">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    {customer.contactPerson}
                  </Box>
                </Typography>
                <Typography variant="body2">
                  <strong>Tax ID:</strong> {customer.taxId}
                </Typography>
              </Grid>
            </Grid>
            
            {customer.notes && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Notes:</strong> {customer.notes}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Sales Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Orders:</Typography>
                  <Typography variant="body2">{customer.totalOrders}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Spend:</Typography>
                  <Typography variant="body2">${customer.totalSpend.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Last Order:</Typography>
                  <Typography variant="body2">{customer.lastOrderDate || 'Never'}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Credit Limit:</Typography>
                  <Typography variant="body2">${customer.creditLimit.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Payment Terms:</Typography>
                  <Typography variant="body2">{customer.paymentTerms}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for Contacts, Orders, Activity */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Contacts" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Orders" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="Activity" icon={<HistoryIcon />} iconPosition="start" />
        </Tabs>
        
        <Divider />
        
        {/* Contacts Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddContact}
              >
                Add Contact
              </Button>
            </Box>
            
            <List>
              {customer.contacts.map((contact) => (
                <ListItem key={contact.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name}
                    secondary={
                      <>
                        <Box component="span" sx={{ display: 'block' }}>{contact.position}</Box>
                        <Box component="span" sx={{ display: 'block' }}>{contact.email}</Box>
                        <Box component="span" sx={{ display: 'block' }}>{contact.phone}</Box>
                        {contact.notes && (
                          <Box component="span" sx={{ display: 'block', fontStyle: 'italic' }}>
                            {contact.notes}
                          </Box>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteContact(contact.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {/* Orders Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Tracking</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customer.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={getOrderStatusColor(order.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{order.trackingNumber}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleViewOrder(order.id)}>
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        {/* Activity Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <List>
              {customer.activity.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemAvatar>
                    <Avatar>
                      {activity.type === 'Order' && <AssignmentIcon />}
                      {activity.type === 'Note' && <NoteIcon />}
                      {activity.type === 'Call' && <PhoneIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.description}
                    secondary={
                      <>
                        <Box component="span" sx={{ display: 'block' }}>
                          {activity.date} • {activity.type} • {activity.user}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
}