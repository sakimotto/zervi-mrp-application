import React, { useState, useEffect } from 'react';
import ContactManagement from './ContactManagement';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormHelperText
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const CustomerForm = () => {
  const { id } = useParams();
  const { currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const [customer, setCustomer] = useState({
    name: '',
    type: 'Retail',
    status: 'Active',
    email: '',
    phone: '',
    address: '',
    website: '',
    taxId: '',
    contactPerson: '',
    creditLimit: 10000,
    paymentTerms: 'Net 30',
    notes: '',
    contacts: []
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // In real implementation, would use:
        const response = await api.customer.getCustomerById(id);
        setCustomer(response.data);
      } catch (error) {
        console.error('Error fetching customer:', error);
        setError('Failed to load customer details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const validate = () => {
    const errors = {};
    
    if (!customer.name) errors.name = 'Customer name is required';
    if (!customer.type) errors.type = 'Customer type is required';
    if (!customer.status) errors.status = 'Status is required';
    
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (customer.creditLimit < 0) {
      errors.creditLimit = 'Credit limit cannot be negative';
    }
    
    // Validate contacts
    if (customer.contacts.length > 0) {
      const contactErrors = customer.contacts.map(contact => {
        const contactError = {};
        if (!contact.name) contactError.name = 'Contact name is required';
        if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
          contactError.email = 'Valid email is required';
        }
        return Object.keys(contactError).length > 0 ? contactError : null;
      });
      
      if (contactErrors.some(err => err !== null)) {
        errors.contacts = contactErrors;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleContactChange = (index, field, value) => {
    setCustomer(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
    
    // Clear validation error for this contact if it exists
    if (validationErrors.contacts && Array.isArray(validationErrors.contacts) && validationErrors.contacts[index]) {
      const newContactErrors = [...validationErrors.contacts];
      newContactErrors[index] = null;
      
      setValidationErrors(prev => ({
        ...prev,
        contacts: newContactErrors.some(err => err !== null) ? newContactErrors : undefined
      }));
    }
  };

  const handleAddContact = async (customerId, contactData) => {
    try {
      const response = await api.customer.addCustomerContact(customerId, contactData);
      setCustomer(prev => ({
        ...prev,
        contacts: [...prev.contacts, response.data]
      }));
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Failed to add contact. Please try again.');
    }
  };

  const handleDeleteContact = async (customerId, contactId) => {
    try {
      await api.customer.deleteCustomerContact(customerId, contactId);
      setCustomer(prev => ({
        ...prev,
        contacts: prev.contacts.filter(c => c.id !== contactId)
      }));
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError('Failed to delete contact. Please try again.');
    }
  };

  const handleUpdateContact = async (customerId, contactId, contactData) => {
    try {
      const response = await api.customer.updateCustomerContact(customerId, contactId, contactData);
      setCustomer(prev => ({
        ...prev,
        contacts: prev.contacts.map(c =>
          c.id === contactId ? response.data : c
        )
      }));
    } catch (error) {
      console.error('Error updating contact:', error);
      setError('Failed to update contact. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/sales/customers');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validate()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      // In real implementation, would use:
      let response;
      if (id) {
        response = await api.customer.updateCustomer(id, customer);
      } else {
        response = await api.customer.createCustomer(customer);
      }
      
      setSuccess('Customer saved successfully');
      setTimeout(() => {
        navigate('/sales/customers');
      }, 1500);
    } catch (error) {
      console.error('Error saving customer:', error);
      setError('Failed to save customer. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {id ? 'Edit Customer' : 'Create New Customer'}
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<CancelIcon />} 
            onClick={handleCancel}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Customer'}
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Customer Information" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Customer Name"
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!validationErrors.type}>
                    <InputLabel>Customer Type</InputLabel>
                    <Select
                      name="type"
                      value={customer.type}
                      onChange={handleChange}
                      label="Customer Type"
                    >
                      <MenuItem value="Retail">Retail</MenuItem>
                      <MenuItem value="Wholesale">Wholesale</MenuItem>
                      <MenuItem value="Distributor">Distributor</MenuItem>
                      <MenuItem value="Government">Government</MenuItem>
                    </Select>
                    {validationErrors.type && (
                      <FormHelperText>{validationErrors.type}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!validationErrors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={customer.status}
                      onChange={handleChange}
                      label="Status"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Prospect">Prospect</MenuItem>
                    </Select>
                    {validationErrors.status && (
                      <FormHelperText>{validationErrors.status}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={customer.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Website"
                    name="website"
                    value={customer.website}
                    onChange={handleChange}
                    placeholder="https://"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tax ID"
                    name="taxId"
                    value={customer.taxId}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Person"
                    name="contactPerson"
                    value={customer.contactPerson}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={customer.notes}
                    onChange={handleChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
      
          <ContactManagement
            customerId={id || ''}
            contacts={customer.contacts}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
          />
        </Grid>
        
        {/* Payment Terms */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Payment Terms" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Credit Limit ($)"
                    name="creditLimit"
                    type="number"
                    value={customer.creditLimit}
                    onChange={handleChange}
                    error={!!validationErrors.creditLimit}
                    helperText={validationErrors.creditLimit}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Terms</InputLabel>
                    <Select
                      name="paymentTerms"
                      value={customer.paymentTerms}
                      onChange={handleChange}
                      label="Payment Terms"
                    >
                      <MenuItem value="Net 15">Net 15</MenuItem>
                      <MenuItem value="Net 30">Net 30</MenuItem>
                      <MenuItem value="Net 60">Net 60</MenuItem>
                      <MenuItem value="Due on Receipt">Due on Receipt</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerForm;