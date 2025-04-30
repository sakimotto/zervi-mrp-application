import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, Divider, List, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, ListItemButton, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Inventory, Architecture, Factory, SwapHoriz, ShoppingCart, LocalShipping, AttachMoney, Settings, Logout, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DivisionSelector from '../common/DivisionSelector';

// Specialized operation icons
import LaminatingIcon from '@mui/icons-material/Layers';
import CuttingIcon from '@mui/icons-material/ContentCut';
import SewingIcon from '@mui/icons-material/LinearScale';
import EmbroideryIcon from '@mui/icons-material/Brush';

const drawerWidth = 240;

const MainLayout = () => {
  const navigate = useNavigate();
  const { currentUser, logout, currentDivision } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  const [operationsMenuOpen, setOperationsMenuOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOperationsToggle = () => {
    setOperationsMenuOpen(!operationsMenuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div">
          Zervi MRP
        </Typography>
      </Toolbar>
      <Divider />
      <DivisionSelector />
      <Divider />
      <List>
        <ListItemButton onClick={() => navigateTo('/dashboard')}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {currentDivision && (
          <ListItemButton onClick={() => navigateTo(`/divisions/${currentDivision.code.toLowerCase()}`)}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary={`${currentDivision.name} Dashboard`} />
          </ListItemButton>
        )}

        <ListItemButton onClick={() => navigateTo('/inventory')}>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItemButton>

        <ListItemButton onClick={() => navigateTo('/boms')}>
          <ListItemIcon>
            <Architecture />
          </ListItemIcon>
          <ListItemText primary="BOM Management" />
        </ListItemButton>

        <ListItemButton onClick={() => navigateTo('/manufacturing/orders')}>
          <ListItemIcon>
            <Factory />
          </ListItemIcon>
          <ListItemText primary="Manufacturing" />
        </ListItemButton>

        <ListItemButton onClick={handleOperationsToggle}>
          <ListItemIcon>
            <Factory />
          </ListItemIcon>
          <ListItemText primary="Specialized Operations" />
        </ListItemButton>

        {operationsMenuOpen && (
          <Box sx={{ pl: 4 }}>
            <ListItemButton onClick={() => navigateTo('/operations/laminating')}>
              <ListItemIcon>
                <LaminatingIcon />
              </ListItemIcon>
              <ListItemText primary="Laminating" />
            </ListItemButton>
            
            <ListItemButton onClick={() => navigateTo('/operations/cutting')}>
              <ListItemIcon>
                <CuttingIcon />
              </ListItemIcon>
              <ListItemText primary="Cutting" />
            </ListItemButton>
            
            <ListItemButton onClick={() => navigateTo('/operations/sewing')}>
              <ListItemIcon>
                <SewingIcon />
              </ListItemIcon>
              <ListItemText primary="Sewing" />
            </ListItemButton>
            
            <ListItemButton onClick={() => navigateTo('/operations/embroidery')}>
              <ListItemIcon>
                <EmbroideryIcon />
              </ListItemIcon>
              <ListItemText primary="Embroidery" />
            </ListItemButton>
          </Box>
        )}

        <ListItemButton onClick={() => navigateTo('/transfers')}>
          <ListItemIcon>
            <SwapHoriz />
          </ListItemIcon>
          <ListItemText primary="Inter-Division Transfers" />
        </ListItemButton>

        <ListItemButton onClick={() => navigateTo('/sales/orders')}>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Sales" />
        </ListItemButton>

        <ListItemButton onClick={() => navigateTo('/procurement/orders')}>
          <ListItemIcon>
            <LocalShipping />
          </ListItemIcon>
          <ListItemText primary="Procurement" />
        </ListItemButton>

        <ListItemButton onClick={() => navigateTo('/costing')}>
          <ListItemIcon>
            <AttachMoney />
          </ListItemIcon>
          <ListItemText primary="Costing" />
        </ListItemButton>

        <ListItemButton onClick={() => navigateTo('/settings')}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentDivision ? `${currentDivision.name} Division` : 'Zervi MRP'}
          </Typography>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(userMenuAnchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(userMenuAnchorEl) ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {currentUser?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={userMenuAnchorEl}
            id="account-menu"
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => navigateTo('/profile')}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
