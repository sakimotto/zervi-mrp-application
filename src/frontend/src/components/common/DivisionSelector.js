import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Box, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const DivisionSelector = () => {
  const { userDivisions, currentDivision, switchDivision } = useAuth();
  
  const handleChange = (event) => {
    switchDivision(event.target.value);
  };

  if (!userDivisions || userDivisions.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No divisions assigned
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="division-select-label">Division</InputLabel>
        <Select
          labelId="division-select-label"
          id="division-select"
          value={currentDivision?.id || ''}
          label="Division"
          onChange={handleChange}
        >
          {userDivisions.map((division) => (
            <MenuItem key={division.id} value={division.id}>
              {division.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DivisionSelector;
