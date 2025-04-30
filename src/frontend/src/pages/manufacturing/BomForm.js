import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardHeader, Divider, Button, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const BomForm = () => {
  const { id } = useParams();
  const { currentDivision } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [items, setItems] = useState([]);
  
  const [bom, setBom] = useState({
    name: '',
    description: '',
    itemId: '',
    divisionId: currentDivision?.id || '',
    version: '1.0',
    status: 'active',
    components: []
  });
  
  const [newComponent, setNewComponent] = useState({
    childItemId: '',
    quantity: 1,
    unitOfMeasurement: '',
    level: 1,
    position: 1,
    notes: ''
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.item.getAllItems({ divisionId: currentDivision?.id });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to load items. Please try again.');
      }
    };

    const fetchBom = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await api.bom.getBomById(id);
        setBom(response.data);
      } catch (error) {
        console.error('Error fetching BOM:', error);
        setError('Failed to load BOM details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
    if (id) {
      fetchBom();
    }
  }, [id, currentDivision]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBom(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComponentChange = (e) => {
    const { name, value } = e.target;
    setNewComponent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addComponent = () => {
    if (!newComponent.childItemId) {
      setError('Please select a component item');
      return;
    }
    
    const selectedItem = items.find(item => item.id === newComponent.childItemId);
    
    setBom(prev => ({
      ...prev,
      components: [
        ...prev.components,
        {
          ...newComponent,
          id: `temp-${Date.now()}`, // Temporary ID for UI purposes
          childItemName: selectedItem?.name || 'Unknown Item'
        }
      ]
    }));
    
    // Reset new component form
    setNewComponent({
      childItemId: '',
      quantity: 1,
      unitOfMeasurement: '',
      level: 1,
      position: bom.components.length + 1,
      notes: ''
    });
    
    setSuccess('Component added successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const removeComponent = (index) => {
    setBom(prev => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      let response;
      if (id) {
        response = await api.bom.updateBom(id, bom);
      } else {
        response = await api.bom.createBom(bom);
      }
      
      setSuccess('BOM saved successfully');
      setTimeout(() => {
        navigate('/manufacturing/boms');
      }, 2000);
    } catch (error) {
      console.error('Error saving BOM:', error);
      setError('Failed to save BOM. Please try again.');
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
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Bill of Materials' : 'Create New Bill of Materials'}
      </Typography>
      
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="BOM Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="BOM Name"
                    name="name"
                    value={bom.name}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={3}
                    value={bom.description}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Parent Item</InputLabel>
                    <Select
                      name="itemId"
                      value={bom.itemId}
                      label="Parent Item"
                      onChange={handleChange}
                    >
                      {items.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name} ({item.itemType})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Version"
                    name="version"
                    value={bom.version}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={bom.status}
                      label="Status"
                      onChange={handleChange}
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="obsolete">Obsolete</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Add Component" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Component Item</InputLabel>
                    <Select
                      name="childItemId"
                      value={newComponent.childItemId}
                      label="Component Item"
                      onChange={handleComponentChange}
                    >
                      {items.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name} ({item.itemType})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={newComponent.quantity}
                    onChange={handleComponentChange}
                    inputProps={{ min: 0.01, step: 0.01 }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Unit of Measurement"
                    name="unitOfMeasurement"
                    value={newComponent.unitOfMeasurement}
                    onChange={handleComponentChange}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Level"
                    name="level"
                    value={newComponent.level}
                    onChange={handleComponentChange}
                    inputProps={{ min: 1, step: 1 }}
                    helperText="Level in BOM hierarchy (1 = direct component)"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Position"
                    name="position"
                    value={newComponent.position}
                    onChange={handleComponentChange}
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={newComponent.notes}
                    onChange={handleComponentChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={addComponent}
                  >
                    Add Component
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="BOM Components" 
              subheader={`${bom.components.length} components added`}
            />
            <Divider />
            <CardContent>
              {bom.components.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  No components added yet. Use the form above to add components.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Item</th>
                            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Quantity</th>
                            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>UOM</th>
                            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Level</th>
                            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Position</th>
                            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bom.components.map((component, index) => (
                            <tr key={component.id || index}>
                              <td style={{ padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                {component.childItemName || items.find(i => i.id === component.childItemId)?.name || 'Unknown Item'}
                              </td>
                              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                {component.quantity}
                              </td>
                              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                {component.unitOfMeasurement}
                              </td>
                              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                {component.level}
                              </td>
                              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                {component.position}
                              </td>
                              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => removeComponent(index)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/manufacturing/boms')}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSaving}
            >
              {isSaving ? <CircularProgress size={24} /> : (id ? 'Update BOM' : 'Create BOM')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BomForm;
