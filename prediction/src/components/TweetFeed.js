import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Link,
  Stack
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Twitter as TwitterIcon,
  Favorite as FavoriteIcon,
  Repeat as RetweetIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

const TweetFeed = ({ cryptoName, cryptoSymbol, isDarkMode }) => {
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);
  const [highlightedTweetIndex, setHighlightedTweetIndex] = useState(null);
  
  useEffect(() => {
    // Generate mock tweet data since we don't have a real Twitter API connection
    if (cryptoName && cryptoSymbol) {
      generateMockTweets(cryptoName, cryptoSymbol);
      setLoading(false);
    }
  }, [cryptoName, cryptoSymbol]);
  
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockTweets = generateMockTweets(cryptoName, cryptoSymbol);
        setTweets(mockTweets.slice(0, 5));
        setError(null);

        let index = 0;
        const interval = setInterval(() => {
          setHighlightedTweetIndex(index);
          index = (index + 1) % 5;

          if (index === 0) {
            clearInterval(interval);
            setTimeout(() => setHighlightedTweetIndex(null), 1000);
          }
        }, 1500);

        return () => clearInterval(interval);
      } catch (err) {
        setError('Failed to load tweets. Please try again later.');
        console.error('Error fetching tweets:', err);
      } finally {
        setLoading(false);
      }
    };

    if (cryptoName && cryptoSymbol) {
      fetchTweets();
    }
  }, [cryptoName, cryptoSymbol]);

  const generateMockTweets = (name, symbol) => {
    const influencers = [
      { 
        name: 'Crypto Insider', 
        username: 'crypto_insider', 
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg', 
        verified: true,
        followers: '245K'
      },
      { 
        name: 'Blockchain Capital', 
        username: 'blockchain_cap', 
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg', 
        verified: true,
        followers: '189K'
      },
      { 
        name: 'Digital Asset Daily', 
        username: 'digitalassetdaily', 
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg', 
        verified: false,
        followers: '76K'
      },
      { 
        name: 'CryptoQueen', 
        username: 'crypto_queen', 
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg', 
        verified: true,
        followers: '321K'
      },
      { 
        name: 'Whale Alert', 
        username: 'whale_alert', 
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg', 
        verified: true,
        followers: '502K'
      }
    ];
    
    const tweetTemplates = [
      `Just analyzed $${symbol} charts, seeing a potential breakout pattern forming. #${name} might be heading for new highs soon! #Crypto #Trading`,
      `Our team's latest report on $${symbol} suggests strong fundamentals despite market volatility. Long-term outlook remains bullish. #${name}`,
      `Breaking: Major institutional investors are accumulating $${symbol} according to on-chain data. This could signal a major move for #${name}!`,
      `$${symbol} just announced a new partnership that could revolutionize their ecosystem. #${name} is definitely one to watch this quarter.`,
      `Technical analysis update: $${symbol} forming a classic cup and handle pattern. Target price projections coming soon. #${name} #CryptoTrading`,
      `The recent development updates from the $${symbol} team are impressive. Solid progress on their roadmap. #${name} fundamentals stronger than ever.`,
      `Sentiment analysis shows $${symbol} mentions are up 43% this week across social media. Bullish signal for #${name}? #CryptoMetrics`,
      `Just interviewed the CTO of #${name} about their upcoming protocol upgrade. Very exciting developments ahead for $${symbol} holders!`
    ];
    
    const getRandomTimestamp = () => {
      const now = new Date();
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      now.setHours(now.getHours() - hoursAgo);
      now.setMinutes(now.getMinutes() - minutesAgo);
      return now;
    };
    
    const getRandomEngagement = () => ({
      likes: Math.floor(Math.random() * 2000) + 50,
      retweets: Math.floor(Math.random() * 500) + 10,
      comments: Math.floor(Math.random() * 200) + 5
    });
    
    const usedTemplates = new Set();
    const usedInfluencers = new Set();
    const mockTweets = [];
    
    for (let i = 0; i < 5; i++) {
      let templateIndex;
      do {
        templateIndex = Math.floor(Math.random() * tweetTemplates.length);
      } while (usedTemplates.has(templateIndex) && usedTemplates.size < tweetTemplates.length);
      usedTemplates.add(templateIndex);
      
      let influencerIndex;
      do {
        influencerIndex = Math.floor(Math.random() * influencers.length);
      } while (usedInfluencers.has(influencerIndex) && usedInfluencers.size < influencers.length);
      usedInfluencers.add(influencerIndex);
      
      const influencer = influencers[influencerIndex];
      const tweetText = tweetTemplates[templateIndex];
      const timestamp = getRandomTimestamp();
      const engagement = getRandomEngagement();
      
      mockTweets.push({
        id: `tweet-${i}`,
        author: influencer,
        text: tweetText,
        timestamp,
        engagement,
        sentiment: Math.random() > 0.3 ? 'bullish' : 'bearish'
      });
    }
    
    return mockTweets.sort((a, b) => b.timestamp - a.timestamp);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'just now';
    }
  };

  const renderTweetSkeleton = () => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        background: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : '#fff',
        backdropFilter: 'blur(5px)',
        boxShadow: isDarkMode 
          ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
          : '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton 
          variant="circular" 
          width={48} 
          height={48}
          sx={{
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
          }}
        />
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton 
              variant="text" 
              width="40%" 
              height={24} 
              sx={{
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }}
            />
            <Skeleton 
              variant="text" 
              width="20%" 
              height={24} 
              sx={{
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }}
            />
          </Box>
          <Skeleton 
            variant="text" 
            width="100%" 
            height={20} 
            sx={{
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              mt: 1
            }}
          />
          <Skeleton 
            variant="text" 
            width="90%" 
            height={20} 
            sx={{
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              mt: 0.5
            }}
          />
          <Skeleton 
            variant="text" 
            width="95%" 
            height={20} 
            sx={{
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              mt: 0.5
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Skeleton 
              variant="rectangular" 
              width="30%" 
              height={30} 
              sx={{ 
                borderRadius: '16px',
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }} 
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box 
      sx={{
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '2px',
          background: isDarkMode 
            ? 'linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.5), rgba(59,130,246,0))' 
            : 'linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.3), rgba(59,130,246,0))',
          zIndex: 1
        }
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 2, 
          mt: 2,
          position: 'relative',
          zIndex: 2
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -3,
              left: 0,
              width: 0,
              height: 2,
              backgroundColor: 'primary.main',
              animation: 'widthGrow 0.8s forwards ease-out',
              borderRadius: '4px'
            }
          }}
        >
          <TwitterIcon 
            color="primary" 
            sx={{ 
              animation: 'pulse 2s infinite',
              filter: isDarkMode 
                ? 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.7))' 
                : 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))'
            }}
          />
          <Box component="span" sx={{ position: 'relative', overflow: 'hidden' }}>
            <span style={{ 
              position: 'relative', 
              animation: 'slideIn 0.7s forwards', 
              display: 'inline-block'
            }}>
              Latest {cryptoName} Tweets
            </span>
          </Box>
        </Typography>
        
        <Chip 
          label="Live Feed" 
          size="small" 
          color="primary" 
          variant="outlined"
          icon={<span className="dot-pulse"></span>}
          sx={{ 
            height: 24,
            '& .MuiChip-label': { pl: 0.5, pr: 1 },
            '& .dot-pulse': {
              width: '8px',
              height: '8px',
              backgroundColor: isDarkMode ? '#60a5fa' : '#3b82f6',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '4px',
              animation: 'dot-pulse 1.5s infinite ease-in-out'
            },
            bgcolor: isDarkMode ? alpha('#3b82f6', 0.1) : alpha('#3b82f6', 0.05),
            backdropFilter: 'blur(4px)',
            border: '1px solid',
            borderColor: isDarkMode ? alpha('#3b82f6', 0.3) : alpha('#3b82f6', 0.2)
          }}
        />
      </Box>
      
      <Divider 
        sx={{ 
          mb: 2, 
          opacity: isDarkMode ? 0.1 : 0.3
        }} 
      />
      
      {loading ? (
        <Box 
          sx={{
            opacity: 0,
            animation: 'fadeIn 0.5s forwards 0.2s'
          }}
        >
          {[...Array(5)].map((_, index) => (
            <Box 
              key={index} 
              sx={{ 
                mb: 2,
                opacity: 0,
                animation: 'fadeIn 0.5s forwards',
                animationDelay: `${0.2 + index * 0.1}s`
              }}
            >
              {renderTweetSkeleton()}
            </Box>
          ))}
        </Box>
      ) : error ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            textAlign: 'center',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            background: isDarkMode ? alpha('#ef4444', 0.1) : alpha('#ef4444', 0.05),
            animation: 'fadeIn 0.5s forwards'
          }}
        >
          <Typography color="error" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box component="span" className="material-icons-outlined">
              error_outline
            </Box>
            {error}
          </Typography>
        </Paper>
      ) : (
        <Box className="tweet-list">
          {tweets.map((tweet, index) => (
            <Paper
              key={tweet.id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                opacity: 0,
                animation: `fadeIn 0.5s forwards ${0.2 + 0.1 * index}s`,
                transform: 'translateY(20px)',
                background: isDarkMode 
                  ? highlightedTweetIndex === index 
                    ? alpha('#1e293b', 0.8) 
                    : alpha('#1e293b', 0.4)
                  : highlightedTweetIndex === index 
                    ? alpha('#f8fafc', 0.95)
                    : '#fff',
                backdropFilter: 'blur(5px)',
                boxShadow: highlightedTweetIndex === index
                  ? isDarkMode 
                    ? `0 6px 20px ${alpha('#000', 0.3)}, 0 0 0 1px ${alpha('#3b82f6', 0.3)}`
                    : `0 6px 20px ${alpha('#3b82f6', 0.15)}, 0 0 0 1px ${alpha('#3b82f6', 0.1)}`
                  : isDarkMode 
                    ? '0 4px 10px rgba(0, 0, 0, 0.2)'
                    : '0 4px 10px rgba(0, 0, 0, 0.03)',
                '&:hover': {
                  boxShadow: isDarkMode 
                    ? `0 8px 25px ${alpha('#000', 0.4)}, 0 0 0 1px ${alpha('#3b82f6', 0.4)}`
                    : `0 8px 25px ${alpha('#3b82f6', 0.2)}, 0 0 0 1px ${alpha('#3b82f6', 0.15)}`,
                  transform: 'translateY(-4px)'
                },
                '&::after': highlightedTweetIndex === index ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: '12px',
                  opacity: 0.5,
                  animation: 'pulse 2s infinite'
                } : {}
              }}
              className="tweet-card"
              onMouseEnter={() => setHighlightedTweetIndex(index)}
              onMouseLeave={() => setHighlightedTweetIndex(null)}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2 
                }}
              >
                <Avatar 
                  src={tweet.author.avatar} 
                  alt={tweet.author.name}
                  sx={{ 
                    width: 48, 
                    height: 48,
                    border: '2px solid',
                    borderColor: isDarkMode ? alpha('#3b82f6', 0.3) : alpha('#3b82f6', 0.2),
                    boxShadow: isDarkMode ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: isDarkMode ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 0 15px rgba(59, 130, 246, 0.3)'
                    }
                  }}
                  className="tweet-avatar"
                />
                
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ fontWeight: 'bold' }}
                          className="author-name"
                        >
                          {tweet.author.name}
                        </Typography>
                        {tweet.author.verified && (
                          <VerifiedIcon 
                            color="primary" 
                            sx={{ 
                              fontSize: 16,
                              animation: 'pulse 2s infinite',
                              filter: isDarkMode ? 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.7))' : 'none'
                            }} 
                          />
                        )}
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          opacity: 0.7
                        }}
                      >
                        @{tweet.author.username} · {tweet.author.followers} followers
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{
                        bgcolor: isDarkMode ? alpha('#3b82f6', 0.1) : alpha('#3b82f6', 0.05),
                        px: 1,
                        py: 0.5,
                        borderRadius: '12px',
                        fontSize: '0.7rem'
                      }}
                    >
                      {formatTimeAgo(tweet.timestamp)}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      my: 1.5, 
                      lineHeight: 1.5,
                      position: 'relative',
                      '&::after': highlightedTweetIndex === index ? {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: '5%',
                        width: '90%',
                        height: 1,
                        background: isDarkMode 
                          ? 'linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.3), rgba(59,130,246,0))' 
                          : 'linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.2), rgba(59,130,246,0))',
                      } : {}
                    }}
                    className="tweet-text"
                  >
                    {tweet.text.split(' ').map((word, i) => {
                      if (word.startsWith('#')) {
                        return (
                          <Link
                            key={i}
                            href="#"
                            underline="hover"
                            sx={{ 
                              color: 'primary.main',
                              fontWeight: 500,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                color: isDarkMode ? '#60a5fa' : '#2563eb',
                                textShadow: isDarkMode ? '0 0 8px rgba(59, 130, 246, 0.7)' : 'none'
                              }
                            }}
                            onClick={(e) => e.preventDefault()}
                            className="hashtag"
                          >
                            {word}{' '}
                          </Link>
                        );
                      } else if (word.startsWith('$')) {
                        return (
                          <Link
                            key={i}
                            href="#"
                            underline="hover"
                            sx={{ 
                              color: 'primary.main', 
                              fontWeight: 'bold',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                color: isDarkMode ? '#60a5fa' : '#2563eb',
                                textShadow: isDarkMode ? '0 0 8px rgba(59, 130, 246, 0.7)' : 'none'
                              }
                            }}
                            onClick={(e) => e.preventDefault()}
                            className="ticker"
                          >
                            {word}{' '}
                          </Link>
                        );
                      }
                      return word + ' ';
                    })}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                    <Stack 
                      direction="row" 
                      spacing={2}
                      sx={{
                        opacity: 0.8,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        className="engagement-item"
                      >
                        <FavoriteIcon 
                          sx={{ 
                            fontSize: 16, 
                            color: 'error.light',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: 'error.main',
                              transform: 'scale(1.1)'
                            }
                          }} 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {tweet.engagement.likes.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        className="engagement-item"
                      >
                        <RetweetIcon 
                          sx={{ 
                            fontSize: 16, 
                            color: 'success.light',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: 'success.main',
                              transform: 'scale(1.1)'
                            }
                          }} 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {tweet.engagement.retweets.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        className="engagement-item"
                      >
                        <CommentIcon 
                          sx={{ 
                            fontSize: 16, 
                            color: 'primary.light',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: 'primary.main',
                              transform: 'scale(1.1)'
                            }
                          }} 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {tweet.engagement.comments.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShareIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: 'text.secondary',
                          opacity: 0.6,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            opacity: 1,
                            color: 'primary.main'
                          },
                          cursor: 'pointer'
                        }} 
                      />
                      
                      <Chip
                        label={tweet.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}
                        size="small"
                        sx={{
                          bgcolor: tweet.sentiment === 'bullish' 
                            ? isDarkMode ? alpha('#22c55e', 0.2) : alpha('#22c55e', 0.1)
                            : isDarkMode ? alpha('#ef4444', 0.2) : alpha('#ef4444', 0.1),
                          color: tweet.sentiment === 'bullish' ? 'success.main' : 'error.main',
                          fontWeight: 'medium',
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: tweet.sentiment === 'bullish'
                            ? isDarkMode ? alpha('#22c55e', 0.3) : alpha('#22c55e', 0.2)
                            : isDarkMode ? alpha('#ef4444', 0.3) : alpha('#ef4444', 0.2),
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: tweet.sentiment === 'bullish'
                              ? '0 0 10px rgba(34, 197, 94, 0.3)'
                              : '0 0 10px rgba(239, 68, 68, 0.3)'
                          }
                        }}
                        className={`sentiment-chip ${tweet.sentiment}-sentiment`}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
      
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes dot-pulse {
          0% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.4; transform: scale(0.8); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes widthGrow {
          from { width: 0; }
          to { width: 40px; }
        }
        
        .bullish-sentiment {
          animation: bullishPulse 3s infinite;
        }
        
        .bearish-sentiment {
          animation: bearishPulse 3s infinite;
        }
        
        @keyframes bullishPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(34, 197, 94, 0); }
          50% { box-shadow: 0 0 8px rgba(34, 197, 94, 0.5); }
        }
        
        @keyframes bearishPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(239, 68, 68, 0); }
          50% { box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }
        }
      `}</style>
    </Box>
  );
};

export default TweetFeed;
