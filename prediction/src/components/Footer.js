import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link, 
  IconButton, 
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { 
  GitHub, 
  Twitter, 
  LinkedIn, 
  Telegram, 
  ArrowUpward,
  Copyright
} from '@mui/icons-material';

const Footer = ({ isDarkMode }) => {
  const theme = useTheme();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        pt: 6,
        pb: 3,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(249, 250, 251, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid',
        borderColor: isDarkMode ? alpha(theme.palette.divider, 0.3) : alpha(theme.palette.divider, 0.5)
      }}
    >
      {/* Animated wave background */}
      <Box
        className="footer-wave"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3,
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            width: '400%', 
            height: 200, 
            transform: 'rotate(180deg)',
            animation: 'wave 25s linear infinite',
            fill: isDarkMode ? '#3b82f6' : '#3b82f6'
          }}
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </Box>

      {/* Floating particles */}
      <Box className="footer-particles">
        {[...Array(12)].map((_, index) => (
          <Box
            key={index}
            className="particle"
            sx={{
              position: 'absolute',
              width: index % 5 === 0 ? '10px' : index % 3 === 0 ? '6px' : '4px',
              height: index % 5 === 0 ? '10px' : index % 3 === 0 ? '6px' : '4px',
              borderRadius: '50%',
              backgroundColor: index % 3 === 0 ? '#3b82f6' : index % 4 === 0 ? '#8b5cf6' : '#60a5fa',
              opacity: 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatParticle ${(Math.random() * 10) + 10}s linear infinite`,
              animationDelay: `${index * 0.3}s`,
              zIndex: 1
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Scroll to top button with animation */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 5 
          }}
        >
          <IconButton
            onClick={scrollToTop}
            aria-label="scroll to top"
            className="scroll-to-top-button"
            sx={{
              backgroundColor: isDarkMode ? alpha('#3b82f6', 0.2) : alpha('#3b82f6', 0.1),
              color: '#3b82f6',
              border: '2px solid',
              borderColor: isDarkMode ? alpha('#3b82f6', 0.3) : alpha('#3b82f6', 0.2),
              width: 50,
              height: 50,
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              '&:hover': {
                backgroundColor: isDarkMode ? alpha('#3b82f6', 0.3) : alpha('#3b82f6', 0.2),
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
              },
              animation: 'bounce 2s infinite'
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>

        {/* Footer content */}
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  letterSpacing: '-0.05em',
                  mb: 2
                }}
              >
                Crypto<span style={{ color: '#3b82f6' }}>Predict</span>
                <Box 
                  component="span"
                  sx={{ 
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    ml: 0.5,
                    mb: 0,
                    animation: 'pulseDot 3s infinite'
                  }}
                />
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '300px',
                  mx: { xs: 'auto', md: 0 },
                  animation: 'fadeInUp 0.8s forwards',
                  opacity: 0
                }}
              >
                Advanced AI-powered cryptocurrency price predictions to help you make informed investment decisions.
              </Typography>
              
              <Box 
                sx={{ 
                  mt: 3, 
                  display: 'flex', 
                  gap: 1.5,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                {[
                  { icon: <GitHub />, delay: 0 },
                  { icon: <Twitter />, delay: 0.1 },
                  { icon: <LinkedIn />, delay: 0.2 },
                  { icon: <Telegram />, delay: 0.3 }
                ].map((social, index) => (
                  <IconButton 
                    key={index}
                    sx={{ 
                      color: isDarkMode ? alpha('#3b82f6', 0.8) : alpha('#3b82f6', 0.7),
                      backgroundColor: isDarkMode ? alpha('#3b82f6', 0.1) : alpha('#3b82f6', 0.05),
                      transition: 'all 0.3s ease',
                      animation: 'fadeInRight 0.5s forwards',
                      animationDelay: `${social.delay + 0.5}s`,
                      opacity: 0,
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        color: '#3b82f6',
                        backgroundColor: isDarkMode ? alpha('#3b82f6', 0.2) : alpha('#3b82f6', 0.1)
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                textAlign: { xs: 'center', sm: 'left' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: { xs: '50%', sm: 0 },
                  transform: { xs: 'translateX(-50%)', sm: 'none' },
                  width: 40,
                  height: 2,
                  backgroundColor: '#3b82f6',
                  animation: 'widthGrow 0.6s forwards'
                }
              }}
            >
              Quick Links
            </Typography>
            <Box 
              component="ul" 
              sx={{ 
                listStyle: 'none', 
                p: 0, 
                m: 0,
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              {['Home', 'About', 'Features', 'Pricing', 'Contact'].map((item, index) => (
                <Box 
                  component="li" 
                  key={item}
                  sx={{ 
                    mb: 1,
                    animation: 'fadeInUp 0.5s forwards',
                    animationDelay: `${index * 0.1 + 0.2}s`,
                    opacity: 0
                  }}
                >
                  <Link 
                    href="#" 
                    underline="none" 
                    color="text.secondary"
                    sx={{ 
                      display: 'inline-block',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#3b82f6',
                        transform: 'translateX(5px)'
                      },
                      '&::before': {
                        content: '"→"',
                        position: 'absolute',
                        left: -20,
                        opacity: 0,
                        transition: 'all 0.3s ease'
                      },
                      '&:hover::before': {
                        opacity: 1,
                        left: -15
                      }
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                textAlign: { xs: 'center', sm: 'left' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: { xs: '50%', sm: 0 },
                  transform: { xs: 'translateX(-50%)', sm: 'none' },
                  width: 40,
                  height: 2,
                  backgroundColor: '#3b82f6',
                  animation: 'widthGrow 0.6s forwards',
                  animationDelay: '0.1s'
                }
              }}
            >
              Resources
            </Typography>
            <Box 
              component="ul" 
              sx={{ 
                listStyle: 'none', 
                p: 0, 
                m: 0,
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              {['Blog', 'Tutorials', 'Documentation', 'API', 'Support'].map((item, index) => (
                <Box 
                  component="li" 
                  key={item}
                  sx={{ 
                    mb: 1,
                    animation: 'fadeInUp 0.5s forwards',
                    animationDelay: `${index * 0.1 + 0.3}s`,
                    opacity: 0
                  }}
                >
                  <Link 
                    href="#" 
                    underline="none" 
                    color="text.secondary"
                    sx={{ 
                      display: 'inline-block',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#3b82f6',
                        transform: 'translateX(5px)'
                      },
                      '&::before': {
                        content: '"→"',
                        position: 'absolute',
                        left: -20,
                        opacity: 0,
                        transition: 'all 0.3s ease'
                      },
                      '&:hover::before': {
                        opacity: 1,
                        left: -15
                      }
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                textAlign: { xs: 'center', md: 'left' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: { xs: '50%', md: 0 },
                  transform: { xs: 'translateX(-50%)', md: 'none' },
                  width: 40,
                  height: 2,
                  backgroundColor: '#3b82f6',
                  animation: 'widthGrow 0.6s forwards',
                  animationDelay: '0.2s'
                }
              }}
            >
              Stay Connected
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 2, 
                textAlign: { xs: 'center', md: 'left' },
                animation: 'fadeInUp 0.5s forwards',
                animationDelay: '0.3s',
                opacity: 0
              }}
            >
              Subscribe to our newsletter for the latest cryptocurrency news, price predictions and market insights.
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                animation: 'fadeInUp 0.5s forwards',
                animationDelay: '0.4s',
                opacity: 0
              }}
            >
              <Box 
                component="input"
                placeholder="Your email address"
                sx={{
                  flex: 1,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isDarkMode ? alpha(theme.palette.divider, 0.3) : alpha(theme.palette.divider, 0.5),
                  backgroundColor: isDarkMode ? alpha('#1e293b', 0.8) : alpha('#fff', 0.8),
                  color: isDarkMode ? theme.palette.text.primary : theme.palette.text.primary,
                  p: 1.5,
                  outline: 'none',
                  width: { xs: '100%', sm: 'auto' },
                  '&:focus': {
                    borderColor: '#3b82f6',
                    boxShadow: `0 0 0 2px ${alpha('#3b82f6', 0.2)}`
                  },
                  '&::placeholder': {
                    color: isDarkMode ? alpha(theme.palette.text.primary, 0.5) : alpha(theme.palette.text.primary, 0.5)
                  },
                  transition: 'all 0.3s ease'
                }}
              />
              <Box
                component="button"
                sx={{
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  p: 1.5,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    backgroundColor: '#2563eb',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                Subscribe
              </Box>
            </Box>
            
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                display: 'block',
                animation: 'fadeInUp 0.5s forwards',
                animationDelay: '0.5s',
                opacity: 0
              }}
            >
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, opacity: 0.3 }} />

        {/* Copyright */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5,
              animation: 'fadeIn 1s forwards',
              animationDelay: '0.6s',
              opacity: 0
            }}
          >
            <Copyright fontSize="small" /> {currentYear} CryptoPredict. All rights reserved.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2,
              animation: 'fadeIn 1s forwards',
              animationDelay: '0.7s',
              opacity: 0
            }}
          >
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link 
                key={item} 
                href="#" 
                underline="hover" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.875rem',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#3b82f6'
                  }
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
      
      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes wave {
          0% {
            transform: translateX(0) rotate(180deg);
          }
          100% {
            transform: translateX(-50%) rotate(180deg);
          }
        }
        
        @keyframes floatParticle {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes widthGrow {
          from { width: 0; }
          to { width: 40px; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulseDot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.7;
          }
        }
        
        /* Ensure our particles are visible in dark mode */
        .dark-mode .particle {
          background-color: #60a5fa;
          opacity: 0.6;
        }
      `}</style>
    </Box>
  );
};

export default Footer;
