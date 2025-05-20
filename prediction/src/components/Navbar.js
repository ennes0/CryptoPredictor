import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Fade,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  ListItemIcon,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  TrendingUp,
  Insights,
  Info,
  ContactSupport,
  Close,
  KeyboardArrowDown,
  Forum,
  History,
  Person,
  Notifications,
  Logout,
  Settings,
  LightMode,
  DarkMode,
  Apps
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

// Hide on scroll functionality
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = ({ isDarkMode, toggleDarkMode, notificationCount = 3, handleNotificationsClick, handleUserMenuClick }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElTools, setAnchorElTools] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileAnimation, setProfileAnimation] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items array - remove forum
  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Predictions', path: '/#predictions' },
    { name: 'Analytics', path: '/#analytics' }
  ];

  // Dynamic text color based on page and scroll state
  const getTextColor = () => {
    if (isScrolled) {
      return isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    }
    
    // On forum page, use different colors for better visibility
    if (location.pathname === '/forum') {
      return isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    }
    
    // Default (home page and other pages) - white text for better contrast on gradient backgrounds
    return 'white';
  };

  const tools = [
    { name: 'Portfolio Tracker', path: '/portfolio' },
    { name: 'Price Alerts', path: '/alerts' },
    { name: 'API Access', path: '/api' }
  ];
  
  const resources = [
    { name: 'About', icon: <Info fontSize="small" />, path: '/about' },
    { name: 'Help', icon: <ContactSupport fontSize="small" />, path: '/help' }
  ];

  const profileMenuItems = [
    { name: 'Profile', icon: <Person fontSize="small" />, path: '/profile' },
    { name: 'Settings', icon: <Settings fontSize="small" />, path: '/settings' },
    { name: 'Logout', icon: <Logout fontSize="small" />, path: '/logout' },
  ];

  const notifications = [
    { id: 1, text: "Bitcoin prediction updated", read: false },
    { id: 2, text: "Ethereum price alert triggered", read: false },
    { id: 3, text: "New market analysis available", read: false }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenToolsMenu = (event) => {
    setAnchorElTools(event.currentTarget);
  };
  
  const handleOpenProfileMenu = (event) => {
    setAnchorElProfile(event.currentTarget);
    setProfileAnimation(true);
    setTimeout(() => setProfileAnimation(false), 500);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  
  const handleCloseToolsMenu = () => {
    setAnchorElTools(null);
  };
  
  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const drawer = (
    <Box
      sx={{ 
        width: 280,
        height: '100%',
        background: isDarkMode 
          ? 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)' 
          : 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
        pt: 1
      }}
      role="presentation"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="img" src="/logo192.png" sx={{ width: 32, height: 32, mr: 1 }} alt="Logo" />
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            CryptoPredict
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} edge="end" sx={{ color: 'text.primary' }}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src="https://randomuser.me/api/portraits/men/32.jpg"
            sx={{ 
              width: 64, 
              height: 64,
              border: '2px solid',
              borderColor: 'primary.main',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
              transition: 'all 0.3s ease',
            }}
          />
          <Badge
            badgeContent={notificationCount}
            color="error"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              '.MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 18,
                minWidth: 18,
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
              }
            }}
          />
        </Box>
      </Box>
      
      <Typography variant="subtitle2" sx={{ 
        textAlign: 'center', 
        fontWeight: 600, 
        mb: 0.5 
      }}>
        Alex Johnson
      </Typography>
      <Typography variant="caption" sx={{ 
        textAlign: 'center', 
        display: 'block',
        color: 'text.secondary',
        mb: 3
      }}>
        Premium member
      </Typography>
      
      <List>
        {navigationItems.map((page) => (
          <ListItem 
            button 
            key={page.name} 
            component={Link} 
            to={page.path} 
            onClick={handleDrawerToggle}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                transform: 'translateX(5px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
              {page.name === 'Home' && <Home fontSize="small" />}
              {page.name === 'Predictions' && <TrendingUp fontSize="small" />}
              {page.name === 'Analytics' && <Insights fontSize="small" />}
            </ListItemIcon>
            <ListItemText 
              primary={page.name} 
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2, mx: 2 }} />
      
      <List>
        {profileMenuItems.map((item) => (
          <ListItem 
            button 
            key={item.name} 
            component={Link} 
            to={item.path} 
            onClick={handleDrawerToggle}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.name} 
              primaryTypographyProps={{
                fontWeight: item.name === 'Logout' ? 500 : 600,
                fontSize: '0.9rem',
                color: item.name === 'Logout' ? 'error.main' : 'inherit'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Get the background color for navbar
  const getNavbarBackground = () => {
    if (isScrolled) {
      return isDarkMode 
        ? 'rgba(15, 23, 42, 0.85)' 
        : 'rgba(255, 255, 255, 0.85)';
    }
    
    if (location.pathname === '/forum') {
      return 'transparent';
    }
    
    return 'transparent';
  };

  // Get the shadow for navbar
  const getNavbarShadow = () => {
    if (isScrolled) {
      return isDarkMode 
        ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
        : '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
    return 'none';
  };

  // Get border for navbar
  const getNavbarBorder = () => {
    if (isScrolled) {
      return isDarkMode 
        ? '1px solid rgba(255, 255, 255, 0.05)' 
        : '1px solid rgba(0, 0, 0, 0.06)';
    }
    return 'none';
  };

  const textColor = getTextColor();

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          color="transparent" 
          elevation={0}
          sx={{
            background: getNavbarBackground(),
            backdropFilter: isScrolled ? 'blur(8px)' : 'none',
            boxShadow: getNavbarShadow(),
            borderBottom: getNavbarBorder(),
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              zIndex: -1
            }
          }}
        >
          <Container maxWidth="xl">
            <Toolbar 
              disableGutters 
              sx={{ 
                py: isScrolled ? 0.5 : 1, 
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1200
              }}
            >
              {/* Logo - always visible */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 2,
                  flexGrow: { xs: 1, md: 0 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': {
                      '& .logo-text': {
                        transform: 'translateY(-2px)',
                      },
                      '& .logo-dot': {
                        transform: 'scale(1.2)',
                      }
                    }
                  }}
                  component={Link}
                  to="/"
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'primary.main',
                      mr: 1.5,
                      backgroundImage: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'rotate(10deg)'
                      }
                    }}
                    alt="CryptoPredict"
                  >
                    <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                  </Avatar>
                  
                  <Typography
                    variant="h6"
                    noWrap
                    className="logo-text"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: { xs: '-0.02em', md: '-0.03em' },
                      color: textColor,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      display: { xs: 'none', sm: 'flex' },
                      alignItems: 'center',
                      textShadow: !location.pathname === '/forum' && !isScrolled ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                    }}
                  >
                    Crypto<span style={{ 
                      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>Predict</span>
                    <Box
                      component="span"
                      className="logo-dot"
                      sx={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        ml: 0.5,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Typography>
                </Box>
              </Box>

              {/* Mobile menu button */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: textColor
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Desktop navigation */}
              <Box sx={{ 
                flexGrow: 1, 
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                ml: 4
              }}>
                {navigationItems.map((page) => (
                  <Button
                    key={page.name}
                    component={Link}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                    sx={{
                      mx: 1,
                      my: 2,
                      position: 'relative',
                      color: textColor,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 2,
                      textShadow: !location.pathname === '/forum' && !isScrolled ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        bgcolor: 'transparent',
                        '&::after': {
                          width: '70%'
                        }
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '15%',
                        width: isActive(page.path) ? '70%' : '0%',
                        height: '3px',
                        borderRadius: '3px',
                        bgcolor: 'primary.main',
                        transition: 'width 0.3s ease',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {page.name === 'Home' && <Home fontSize="small" />}
                      {page.name === 'Predictions' && <TrendingUp fontSize="small" />}
                      {page.name === 'Analytics' && <Insights fontSize="small" />}
                    </Box>
                    {page.name}
                  </Button>
                ))}
              </Box>

              {/* Right side icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Tools Menu */}
                <IconButton
                  onClick={handleOpenToolsMenu}
                  sx={{
                    color: getTextColor(),
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <Apps />
                  </Badge>
                </IconButton>

                {/* Notifications */}
                <IconButton
                  onClick={handleNotificationsClick}
                  sx={{
                    color: getTextColor(),
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>

                {/* Profile Menu */}
                <IconButton
                  onClick={handleUserMenuClick}
                  sx={{
                    color: getTextColor(),
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main'
                    }}
                  >
                    <Person />
                  </Avatar>
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile navigation drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Tools Menu */}
      <Menu
        id="tools-menu"
        anchorEl={anchorElTools}
        open={Boolean(anchorElTools)}
        onClose={handleCloseToolsMenu}
        TransitionComponent={Fade}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
              padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
              '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: 1.5,
              },
            },
          },
        }}
      >
        {tools.map((tool) => (
          <MenuItem key={tool.name} onClick={handleCloseToolsMenu}>
            {tool.icon}
            <Typography variant="body2">{tool.name}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorElProfile}
        open={Boolean(anchorElProfile)}
        onClose={handleCloseProfileMenu}
        TransitionComponent={Fade}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 220,
            boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
          },
        }}
      >
        <Box sx={{ px: 2, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 2 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                User Account
              </Typography>
              <Typography variant="caption" color="text.secondary">
                user@example.com
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Dark Mode
            </Typography>
            <IconButton onClick={toggleDarkMode} size="small">
              {isDarkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleCloseProfileMenu}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseProfileMenu}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseProfileMenu}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
