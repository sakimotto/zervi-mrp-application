import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Zervi MRP System
          </Typography>
          <Outlet />
        </Paper>
      </Container>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 5 }}>
        © {new Date().getFullYear()} Zervi Group. All rights reserved.
      </Typography>
    </Box>
  );
};

export default AuthLayout;
