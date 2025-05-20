import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Badge,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import {
  Search,
  ArrowUpward,
  ArrowDownward,
  Comment,
  Share,
  MoreVert,
  Favorite,
  FavoriteBorder,
  Filter,
  TrendingUp,
  Bookmark,
  BookmarkBorder,
  Person,
  Sort,
  Send,
  AttachFile,
  InsertPhoto,
  EmojiEmotions,
  Add,
  Reply
} from '@mui/icons-material';
import { grey, blue } from '@mui/material/colors';

// Sample thread data for demo purposes
const sampleThreads = [
  {
    id: 1,
    title: "Bitcoin Price Prediction for Q4 2023",
    author: "cryptoexpert",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "Oct 15, 2023",
    content: "After analyzing historical patterns and current market trends, I believe Bitcoin will reach $70,000 by the end of 2023. Institutional adoption continues to grow and the recent ETF approvals are bullish catalysts.",
    upvotes: 128,
    downvotes: 14,
    comments: 43,
    tags: ["Bitcoin", "Price Analysis", "Prediction"],
  },
  {
    id: 2,
    title: "Ethereum 2.0 Impact on Gas Fees",
    author: "eth_enthusiast",
    authorAvatar: "https://randomuser.me/api/portraits/women/29.jpg",
    date: "Oct 12, 2023",
    content: "With the recent Ethereum upgrades, gas fees have significantly decreased. This makes the network more accessible for smaller transactions and DeFi activities. What are your experiences with gas fees recently?",
    upvotes: 96,
    downvotes: 5,
    comments: 32,
    tags: ["Ethereum", "Gas Fees", "DeFi"],
  },
  {
    id: 3,
    title: "Technical Analysis: ADA Breaking Out?",
    author: "chart_analyst",
    authorAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    date: "Oct 10, 2023",
    content: "Cardano (ADA) appears to be forming a bullish pattern on the daily chart. The 50-day moving average has just crossed above the 200-day, forming a golden cross. Volume has been increasing on up days. Thoughts?",
    upvotes: 75,
    downvotes: 8,
    comments: 27,
    tags: ["Cardano", "Technical Analysis", "ADA"],
  },
  {
    id: 4,
    title: "Solana vs Avalanche: Which has better long-term potential?",
    author: "blockchain_dev",
    authorAvatar: "https://randomuser.me/api/portraits/women/14.jpg",
    date: "Oct 8, 2023",
    content: "Both Solana and Avalanche offer high throughput and low transaction costs, but they take different approaches to scaling. Solana focuses on a single, highly optimized chain while Avalanche uses subnets. Which do you think has better long-term potential and why?",
    upvotes: 112,
    downvotes: 23,
    comments: 56,
    tags: ["Solana", "Avalanche", "Layer 1", "Comparison"],
  },
];

// Sample comments data in Reddit-style format
const sampleComments = {
  1: [
    {
      id: 'c1',
      author: 'john_darksoule92',
      authorId: 'user1',
      avatar: null,
      text: 'HAHŞJSNFMSNFMSNCNSNFJSJCjS kafayi yiyeceğim ya bu ne smk',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      upvotes: 24,
      downvotes: 3,
      userVote: null,
      replies: [
        {
          id: 'c1-reply1',
          author: 'CharacterNo3281',
          authorId: 'user2',
          avatar: null,
          text: 'Ancak tabloda, hayallerde yenebilir zaten.',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          upvotes: 12,
          downvotes: 0,
          userVote: null,
          replies: []
        }
      ]
    },
    {
      id: 'c2',
      author: 'Wolfthegray_',
      authorId: 'user3',
      avatar: null,
      text: 'Adam iskelete dönmüş, minnacık kalmış. Ha gayret öleceksin zombi adam sıktır git artık lütfen.',
      timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
      upvotes: 18,
      downvotes: 2,
      userVote: null,
      replies: [
        {
          id: 'c2-reply1',
          author: 'Competitive-Site3784',
          authorId: 'user4',
          avatar: null,
          text: 'yabancıların cadılar bayramında evlerini süslemek için kullandıkları iskeletlere benziyor',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          upvotes: 8,
          downvotes: 1,
          userVote: null,
          replies: [
            {
              id: 'c2-reply1-reply1',
              author: 'boxors',
              authorId: 'user5',
              avatar: null,
              text: 'Adamlar ciddi ciddi soykak vs chad meme yapıp tabloya koymuş mına kodukları.',
              timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
              upvotes: 5,
              downvotes: 0,
              userVote: null,
              replies: []
            }
          ]
        }
      ]
    },
    {
      id: 'c3',
      author: 'Available_Site4527',
      authorId: 'user6',
      avatar: null,
      text: 'BU NE LAN JFJDKDKDKDKFKDKDKFLDJFLF',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      upvotes: 7,
      downvotes: 1,
      userVote: null,
      replies: []
    },
    {
      id: 'c4',
      author: 'Based-Turk1905',
      authorId: 'user7',
      avatar: null,
      text: 'Yerli ve milli şitposting',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      upvotes: 3,
      downvotes: 0,
      userVote: null,
      replies: []
    }
  ],
  2: [], // Empty comments for other threads
  3: [],
  4: []
};

// Helper function to generate avatars (consistent for same user)
const getRandomAvatar = (userId) => {
  const types = ['adventurer', 'adventurer-neutral', 'avataaars', 'big-smile', 'bottts', 'croodles', 'fun-emoji'];
  const randomType = types[userId.charCodeAt(0) % types.length];
  return `https://api.dicebear.com/7.x/${randomType}/svg?seed=${userId}`;
};

// Helper function to format relative time for comments (e.g., "2h ago")
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const commentDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now - commentDate) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Rename the Comment component to ThreadComment to avoid duplicate declaration
const ThreadComment = ({ comment, level = 0, onReply, onVote, isDarkMode, colors }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const maxNestingLevel = 5; // Max nesting level to prevent excessive indentation
  const actualLevel = Math.min(level, maxNestingLevel);
  
  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const avatarUrl = getRandomAvatar(comment.authorId);
  
  return (
    <Box sx={{ 
      mt: 1,
      ml: actualLevel * 3, // Indentation based on nesting level
      position: 'relative',
      transition: 'all 0.3s ease',
    }}>
      {/* Vertical line connector for nested comments */}
      {level > 0 && (
        <Box 
          sx={{ 
            position: 'absolute', 
            left: -16, 
            top: 0, 
            bottom: 0, 
            width: 2, 
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
            ml: -4
          }} 
        />
      )}
      
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        width: '100%'
      }}>
        {/* Voting buttons (vertical) */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          pt: 1
        }}>
          <IconButton 
            size="small" 
            onClick={() => onVote(comment.id, 'upvote')}
            sx={{ 
              p: 0.5, 
              color: comment.userVote === 'upvote' ? colors.upvoteActive : colors.secondaryText
            }}
          >
            <ArrowUpward fontSize="small" />
          </IconButton>
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 'medium',
              color: comment.userVote === 'upvote' 
                ? colors.upvoteActive 
                : comment.userVote === 'downvote' 
                  ? colors.downvoteActive 
                  : colors.secondaryText
            }}
          >
            {comment.upvotes - comment.downvotes}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => onVote(comment.id, 'downvote')}
            sx={{ 
              p: 0.5, 
              color: comment.userVote === 'downvote' ? colors.downvoteActive : colors.secondaryText
            }}
          >
            <ArrowDownward fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ width: '100%' }}>
          {/* Comment header with author info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 0.5
          }}>
            <Avatar 
              src={avatarUrl}
              alt={comment.author}
              sx={{ width: 24, height: 24 }}
            />
            <Typography 
              variant="body2" 
              component="span"
              sx={{ 
                fontWeight: 'bold',
                color: colors.primaryText,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {comment.author}
            </Typography>
            <Typography
              variant="caption"
              component="span"
              color={colors.secondaryText}
            >
              · {formatRelativeTime(comment.timestamp)}
            </Typography>
          </Box>

          {/* Comment text */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: colors.primaryText,
              mb: 1,
              wordBreak: 'break-word'
            }}
          >
            {comment.text}
          </Typography>

          {/* Comment actions */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1
            }}
          >
            <Button 
              size="small" 
              startIcon={<Reply fontSize="small" />}
              sx={{ 
                color: colors.secondaryText, 
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                minWidth: 0,
                p: 0.5,
                '&:hover': {
                  bgcolor: 'transparent',
                  color: colors.buttonText
                }
              }}
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </Button>
            
            {comment.replies && comment.replies.length > 0 && (
              <Button
                size="small"
                sx={{
                  color: colors.secondaryText,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  minWidth: 0,
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: colors.buttonText
                  }
                }}
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Hide replies' : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
              </Button>
            )}
          </Box>
          
          {/* Reply input field */}
          {showReplyInput && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1, 
              mb: 2,
              mt: 1
            }}>
              <Avatar
                sx={{ width: 24, height: 24 }}
              >
                <Typography variant="caption">Me</Typography>
              </Avatar>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        color="primary"
                        disabled={!replyText.trim()}
                        onClick={handleReplySubmit}
                      >
                        <Send fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}
          
          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {comment.replies.map(reply => (
                <ThreadComment
                  key={reply.id}
                  comment={reply}
                  level={level + 1}
                  onReply={onReply}
                  onVote={onVote}
                  isDarkMode={isDarkMode}
                  colors={colors}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const Forum = ({ isDarkMode }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [threads, setThreads] = useState(sampleThreads);
  const [voteStatus, setVoteStatus] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [commentText, setCommentText] = useState('');
  const theme = useTheme();
  
  // NEW: State for thread comments
  const [threadComments, setThreadComments] = useState(sampleComments);
  const [activeThread, setActiveThread] = useState(null);
  const [commentVotes, setCommentVotes] = useState({});
  const [expandedThread, setExpandedThread] = useState(null);

  // Color configurations based on theme mode
  const colors = {
    background: isDarkMode ? '#121212' : '#f5f7fa',
    paper: isDarkMode ? '#1e1e1e' : '#ffffff',
    cardBg: isDarkMode ? '#242424' : '#ffffff',
    primaryText: isDarkMode ? '#ffffff' : '#111827',
    secondaryText: isDarkMode ? '#a0aec0' : '#4b5563',
    borderColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    hoverBg: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
    chipBg: isDarkMode ? '#333333' : '#e5e7eb',
    chipText: isDarkMode ? '#e0e0e0' : '#4b5563',
    divider: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    buttonText: isDarkMode ? '#90caf9' : '#1976d2',
    iconColor: isDarkMode ? '#90caf9' : '#1976d2',
    upvoteActive: '#4caf50',
    downvoteActive: '#f44336',
    tabsIndicator: isDarkMode ? '#90caf9' : '#1976d2',
    inputBg: isDarkMode ? 'rgba(255,255,255,0.09)' : '#ffffff',
    inputBorder: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
    cardShadow: isDarkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.36)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleVote = (threadId, isUpvote) => {
    const currentStatus = voteStatus[threadId] || 'none';
    let newStatus;

    if (isUpvote) {
      newStatus = currentStatus === 'upvoted' ? 'none' : 'upvoted';
    } else {
      newStatus = currentStatus === 'downvoted' ? 'none' : 'downvoted';
    }

    setVoteStatus({...voteStatus, [threadId]: newStatus});
    
    // Update thread votes
    setThreads(threads.map(thread => {
      if (thread.id !== threadId) return thread;
      
      let upvoteChange = 0;
      let downvoteChange = 0;
      
      if (isUpvote) {
        if (newStatus === 'upvoted') upvoteChange = 1;
        if (currentStatus === 'upvoted') upvoteChange = -1;
        if (currentStatus === 'downvoted') downvoteChange = -1;
      } else {
        if (newStatus === 'downvoted') downvoteChange = 1;
        if (currentStatus === 'downvoted') downvoteChange = -1;
        if (currentStatus === 'upvoted') upvoteChange = -1;
      }
      
      return {
        ...thread,
        upvotes: thread.upvotes + upvoteChange,
        downvotes: thread.downvotes + downvoteChange
      };
    }));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortMenuOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleOpenNewThread = () => {
    setNewThreadOpen(true);
  };

  const handleCloseNewThread = () => {
    setNewThreadOpen(false);
  };

  const handleCreateThread = () => {
    if (!newThread.title.trim() || !newThread.content.trim()) return;
    
    const createdThread = {
      id: threads.length + 1,
      title: newThread.title,
      author: "current_user",
      authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      date: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}),
      content: newThread.content,
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      tags: newThread.tags.length > 0 ? newThread.tags : ["General"]
    };
    
    setThreads([createdThread, ...threads]);
    setNewThread({ title: '', content: '', tags: [] });
    setNewThreadOpen(false);
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value.trim()) {
      const newTag = event.target.value.trim();
      if (!newThread.tags.includes(newTag)) {
        setNewThread({...newThread, tags: [...newThread.tags, newTag]});
      }
      event.target.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewThread({
      ...newThread, 
      tags: newThread.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmitComment = (threadId) => {
    if (!commentText.trim()) return;
    
    // In a real app, you would send this to an API
    // For demo purposes, we just update the thread's comment count
    setThreads(threads.map(thread => {
      if (thread.id === threadId) {
        return {...thread, comments: thread.comments + 1};
      }
      return thread;
    }));
    
    setCommentText('');
  };

  // NEW: Add comment to thread
  const handleAddComment = (threadId) => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You',  // In a real app, this would be the current user
      authorId: 'current-user',
      avatar: null,
      text: commentText,
      timestamp: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      userVote: 'upvote', // Auto-upvote your own comment
      replies: []
    };
    
    setThreadComments(prev => {
      const threadCommentsList = prev[threadId] || [];
      return {
        ...prev,
        [threadId]: [newComment, ...threadCommentsList]
      };
    });
    
    // Update thread's comment count
    setThreads(threads.map(thread => {
      if (thread.id === threadId) {
        return {...thread, comments: thread.comments + 1};
      }
      return thread;
    }));
    
    setCommentText('');
  };
  
  // NEW: Reply to a comment
  const handleReplyToComment = (commentId, replyText) => {
    if (!activeThread) return;
    
    const newReply = {
      id: `reply-${Date.now()}`,
      author: 'You',
      authorId: 'current-user',
      avatar: null,
      text: replyText,
      timestamp: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      userVote: 'upvote', // Auto-upvote your own reply
      replies: []
    };
    
    // Find and update the comment with the new reply
    const updateReplies = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        } else if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateReplies(comment.replies)
          };
        }
        return comment;
      });
    };
    
    setThreadComments(prev => {
      const threadCommentsList = prev[activeThread] || [];
      return {
        ...prev,
        [activeThread]: updateReplies(threadCommentsList)
      };
    });
    
    // Update thread's comment count
    setThreads(threads.map(thread => {
      if (thread.id === activeThread) {
        return {...thread, comments: thread.comments + 1};
      }
      return thread;
    }));
  };
  
  // NEW: Vote on a comment
  const handleCommentVote = (commentId, voteType) => {
    // Find and update the comment's vote count
    const updateVotes = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          const currentVote = comment.userVote;
          let upvoteChange = 0;
          let downvoteChange = 0;
          let newUserVote = voteType;
          
          // If already voted the same way, remove the vote
          if (currentVote === voteType) {
            newUserVote = null;
            if (voteType === 'upvote') upvoteChange = -1;
            else downvoteChange = -1;
          } 
          // If changing vote
          else if (currentVote) {
            if (currentVote === 'upvote') upvoteChange = -1;
            else downvoteChange = -1;
            
            if (voteType === 'upvote') upvoteChange += 1;
            else downvoteChange += 1;
          } 
          // If new vote
          else {
            if (voteType === 'upvote') upvoteChange = 1;
            else downvoteChange = 1;
          }
          
          return {
            ...comment,
            upvotes: comment.upvotes + upvoteChange,
            downvotes: comment.downvotes + downvoteChange,
            userVote: newUserVote
          };
        } else if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateVotes(comment.replies)
          };
        }
        return comment;
      });
    };
    
    if (activeThread) {
      setThreadComments(prev => {
        const threadCommentsList = prev[activeThread] || [];
        return {
          ...prev,
          [activeThread]: updateVotes(threadCommentsList)
        };
      });
    }
  };

  // Function to toggle thread expansion (show/hide comments)
  const toggleThreadExpansion = (threadId) => {
    setExpandedThread(expandedThread === threadId ? null : threadId);
    setActiveThread(expandedThread === threadId ? null : threadId);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: isDarkMode ? '#121212' : '#f5f7fa',
        transition: 'background-color 0.3s ease',
        pt: { xs: '72px', md: '80px' }, // Consistent padding for the fixed navbar
        // Add display flex and flexDirection column to properly structure the page
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Container>
        {/* Forum Header */}
        <Box sx={{ mb: 4, mt: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: colors.primaryText,
                  transition: 'color 0.3s ease'
                }}
              >
                Crypto Discussions
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: colors.secondaryText,
                  transition: 'color 0.3s ease'
                }}
              >
                Join the conversation about cryptocurrency trends, predictions, and analysis
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenNewThread}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 2,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                    transition: 'all 0.3s'
                  }
                }}
              >
                New Discussion
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        {/* Search and Filter Bar */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: colors.paper,
            transition: 'background-color 0.3s ease',
            borderRadius: 2,
            boxShadow: colors.cardShadow
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search discussions..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: colors.secondaryText }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: colors.inputBg,
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.inputBorder,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    transition: 'all 0.3s ease'
                  }
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Sort />}
                onClick={handleSortMenuOpen}
                sx={{
                  color: colors.buttonText,
                  borderColor: colors.inputBorder,
                  textTransform: 'none',
                  borderRadius: 2,
                  justifyContent: 'flex-start',
                  transition: 'all 0.3s ease'
                }}
              >
                Sort By
              </Button>
              <Menu
                anchorEl={sortMenuAnchor}
                open={Boolean(sortMenuAnchor)}
                onClose={handleSortMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: colors.paper,
                    boxShadow: colors.cardShadow,
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <MenuItem onClick={handleSortMenuClose}>Newest</MenuItem>
                <MenuItem onClick={handleSortMenuClose}>Most Popular</MenuItem>
                <MenuItem onClick={handleSortMenuClose}>Most Discussed</MenuItem>
                <MenuItem onClick={handleSortMenuClose}>Trending</MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Filter />}
                onClick={handleFilterMenuOpen}
                sx={{
                  color: colors.buttonText,
                  borderColor: colors.inputBorder,
                  textTransform: 'none',
                  borderRadius: 2,
                  justifyContent: 'flex-start',
                  transition: 'all 0.3s ease'
                }}
              >
                Filter
              </Button>
              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleFilterMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: colors.paper,
                    boxShadow: colors.cardShadow,
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <MenuItem onClick={handleFilterMenuClose}>All Categories</MenuItem>
                <MenuItem onClick={handleFilterMenuClose}>Price Predictions</MenuItem>
                <MenuItem onClick={handleFilterMenuClose}>Technical Analysis</MenuItem>
                <MenuItem onClick={handleFilterMenuClose}>Fundamental Analysis</MenuItem>
                <MenuItem onClick={handleFilterMenuClose}>News & Updates</MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: colors.divider, mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                color: colors.secondaryText,
                transition: 'color 0.3s ease',
                '&.Mui-selected': {
                  color: colors.buttonText
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.tabsIndicator,
                transition: 'background-color 0.3s ease'
              }
            }}
          >
            <Tab label="All Discussions" />
            <Tab label="Bitcoin" />
            <Tab label="Ethereum" />
            <Tab label="Altcoins" />
            <Tab label="Technical Analysis" />
            <Tab label="Price Predictions" />
            <Tab label="Market News" />
          </Tabs>
        </Box>
        
        {/* Thread List */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            {threads.map((thread) => (
              <React.Fragment key={thread.id}>
                <Card 
                  sx={{ 
                    mb: expandedThread === thread.id ? 0 : 3, 
                    borderRadius: expandedThread === thread.id ? '20px 20px 0 0' : 2,
                    bgcolor: colors.cardBg,
                    transition: 'all 0.3s ease',
                    boxShadow: colors.cardShadow,
                    '&:hover': {
                      transform: expandedThread === thread.id ? 'none' : 'translateY(-2px)',
                      boxShadow: expandedThread === thread.id ? colors.cardShadow : '0 10px 20px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent>
                    {/* Thread content remains the same */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item>
                          <ListItemAvatar>
                            <Avatar src={thread.authorAvatar} />
                          </ListItemAvatar>
                        </Grid>
                        <Grid item flexGrow={1}>
                          <Typography 
                            variant="subtitle2"
                            sx={{
                              color: colors.primaryText,
                              fontWeight: 'medium',
                              transition: 'color 0.3s ease'
                            }}
                          >
                            {thread.author}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: colors.secondaryText,
                              transition: 'color 0.3s ease'
                            }}
                          >
                            {thread.date}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton 
                            size="small"
                            onClick={handleMenuOpen}
                            sx={{
                              color: colors.secondaryText,
                              transition: 'color 0.3s ease'
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        color: colors.primaryText,
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {thread.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ 
                        color: colors.primaryText,
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {thread.content}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {thread.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small"
                          sx={{ 
                            bgcolor: colors.chipBg,
                            color: colors.chipText,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Divider sx={{ my: 1, borderColor: colors.divider, transition: 'border-color 0.3s ease' }} />
                    
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          color={voteStatus[thread.id] === 'upvoted' ? 'primary' : 'default'}
                          onClick={() => handleVote(thread.id, true)}
                          size="small"
                          sx={{
                            color: voteStatus[thread.id] === 'upvoted' ? colors.upvoteActive : colors.secondaryText,
                            transition: 'color 0.3s ease'
                          }}
                        >
                          <ArrowUpward fontSize="small" />
                        </IconButton>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            mx: 1,
                            color: colors.secondaryText,
                            fontWeight: 'medium',
                            transition: 'color 0.3s ease'
                          }}
                        >
                          {thread.upvotes - thread.downvotes}
                        </Typography>
                        <IconButton
                          color={voteStatus[thread.id] === 'downvoted' ? 'error' : 'default'}
                          onClick={() => handleVote(thread.id, false)}
                          size="small"
                          sx={{
                            color: voteStatus[thread.id] === 'downvoted' ? colors.downvoteActive : colors.secondaryText,
                            transition: 'color 0.3s ease'
                          }}
                        >
                          <ArrowDownward fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          startIcon={<Comment />}
                          size="small"
                          onClick={() => toggleThreadExpansion(thread.id)}
                          sx={{
                            color: expandedThread === thread.id ? colors.buttonText : colors.secondaryText,
                            transition: 'color 0.3s ease',
                            '&:hover': { color: colors.buttonText }
                          }}
                        >
                          {thread.comments} {thread.comments === 1 ? 'Comment' : 'Comments'}
                        </Button>
                        <Button
                          startIcon={<Share />}
                          size="small"
                          sx={{
                            color: colors.secondaryText,
                            transition: 'color 0.3s ease',
                            '&:hover': { color: colors.buttonText }
                          }}
                        >
                          Share
                        </Button>
                        <IconButton
                          size="small"
                          sx={{
                            color: colors.secondaryText,
                            transition: 'color 0.3s ease',
                            '&:hover': { color: colors.buttonText }
                          }}
                        >
                          <BookmarkBorder fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                {/* Comments section */}
                {expandedThread === thread.id && (
                  <Card 
                    sx={{
                      mb: 3,
                      borderRadius: '0 0 20px 20px',
                      bgcolor: colors.cardBg,
                      boxShadow: colors.cardShadow,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box sx={{ p: 2, pt: 0 }}>
                      {/* Add comment input */}
                      <Box sx={{ display: 'flex', width: '100%', gap: 1, py: 2 }}>
                        <Avatar
                          sx={{ width: 32, height: 32 }}
                        >
                          <Typography variant="caption">Me</Typography>
                        </Avatar>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a comment..."
                          variant="outlined"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          multiline
                          minRows={1}
                          maxRows={4}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleAddComment(thread.id)}
                                  edge="end"
                                  size="small"
                                  color="primary"
                                  disabled={!commentText.trim()}
                                >
                                  <Send fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: {
                              bgcolor: colors.inputBg,
                              borderRadius: 4,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: colors.inputBorder,
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                              transition: 'all 0.3s ease'
                            }
                          }}
                        />
                      </Box>
                      
                      {/* Comments sorting */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: colors.secondaryText }}>
                          {thread.comments} {thread.comments === 1 ? 'Comment' : 'Comments'}
                        </Typography>
                        <Button
                          startIcon={<Sort />}
                          size="small"
                          sx={{
                            color: colors.secondaryText,
                            textTransform: 'none',
                            '&:hover': { color: colors.buttonText }
                          }}
                        >
                          Sort by: Top
                        </Button>
                      </Box>
                      
                      {/* Divider */}
                      <Divider sx={{ mb: 2, borderColor: colors.divider }} />
                      
                      {/* Thread comments */}
                      <Box sx={{ mt: 1 }}>
                        {threadComments[thread.id]?.length > 0 ? (
                          threadComments[thread.id].map(comment => (
                            <ThreadComment
                              key={comment.id}
                              comment={comment}
                              onReply={handleReplyToComment}
                              onVote={handleCommentVote}
                              isDarkMode={isDarkMode}
                              colors={colors}
                            />
                          ))
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color={colors.secondaryText}>
                              No comments yet. Be the first to comment!
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Card>
                )}
              </React.Fragment>
            ))}
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: colors.paper,
                borderRadius: 2,
                boxShadow: colors.cardShadow,
                transition: 'all 0.3s ease'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'bold',
                  color: colors.primaryText,
                  transition: 'color 0.3s ease'
                }}
              >
                Trending Topics
              </Typography>
              <List dense>
                {['Bitcoin ETF Approval', 'Ethereum Shanghai Update', 'DeFi Market Recovery', 'NFT Trading Volume'].map((topic, index) => (
                  <ListItem 
                    key={index}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5, 
                      '&:hover': {
                        bgcolor: colors.hoverBg,
                        transition: 'background-color 0.3s ease'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            color: colors.primaryText,
                            transition: 'color 0.3s ease'
                          }}
                        >
                          <TrendingUp fontSize="small" color="primary" />
                          {topic}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            <Paper 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: colors.paper,
                borderRadius: 2,
                boxShadow: colors.cardShadow,
                transition: 'all 0.3s ease'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'bold',
                  color: colors.primaryText,
                  transition: 'color 0.3s ease'
                }}
              >
                Top Contributors
              </Typography>
              <List dense>
                {[
                  { name: 'cryptoexpert', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', posts: 156 },
                  { name: 'eth_enthusiast', avatar: 'https://randomuser.me/api/portraits/women/29.jpg', posts: 124 },
                  { name: 'chart_analyst', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', posts: 98 },
                  { name: 'blockchain_dev', avatar: 'https://randomuser.me/api/portraits/women/14.jpg', posts: 87 }
                ].map((user, index) => (
                  <ListItem 
                    key={index}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5, 
                      '&:hover': {
                        bgcolor: colors.hoverBg,
                        transition: 'background-color 0.3s ease'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: colors.primaryText,
                            transition: 'color 0.3s ease'
                          }}
                        >
                          {user.name}
                        </Typography>
                      }
                      secondary={
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: colors.secondaryText,
                            transition: 'color 0.3s ease'
                          }}
                        >
                          {user.posts} posts
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            <Paper 
              sx={{ 
                p: 2,
                bgcolor: colors.paper,
                borderRadius: 2,
                boxShadow: colors.cardShadow,
                transition: 'all 0.3s ease'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'bold',
                  color: colors.primaryText,
                  transition: 'color 0.3s ease'
                }}
              >
                Popular Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Bitcoin', 'Ethereum', 'DeFi', 'NFT', 'Technical Analysis', 'Altcoins', 'Trading', 'Staking', 'Mining', 'Regulation'].map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small"
                    onClick={() => {}}
                    sx={{ 
                      bgcolor: colors.chipBg,
                      color: colors.chipText,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* New Thread Dialog */}
      <Dialog 
        open={newThreadOpen} 
        onClose={handleCloseNewThread}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: colors.paper,
            borderRadius: 2,
            transition: 'background-color 0.3s ease'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            borderBottom: `1px solid ${colors.divider}`,
            transition: 'border-color 0.3s ease',
            color: colors.primaryText
          }}
        >
          Create New Discussion
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newThread.title}
            onChange={(e) => setNewThread({...newThread, title: e.target.value})}
            InputProps={{
              sx: {
                bgcolor: colors.inputBg,
                transition: 'background-color 0.3s ease'
              }
            }}
            InputLabelProps={{
              sx: { color: colors.secondaryText }
            }}
          />
          <TextField
            margin="dense"
            label="Content"
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            value={newThread.content}
            onChange={(e) => setNewThread({...newThread, content: e.target.value})}
            sx={{ mt: 2 }}
            InputProps={{
              sx: {
                bgcolor: colors.inputBg,
                transition: 'background-color 0.3s ease'
              }
            }}
            InputLabelProps={{
              sx: { color: colors.secondaryText }
            }}
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                color: colors.primaryText,
                transition: 'color 0.3s ease'
              }}
            >
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {newThread.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                  sx={{ 
                    bgcolor: colors.chipBg,
                    color: colors.chipText,
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
              <TextField
                placeholder="Add tags... (press Enter)"
                size="small"
                onKeyDown={handleAddTag}
                InputProps={{
                  sx: {
                    bgcolor: colors.inputBg,
                    minWidth: 150,
                    height: 32,
                    transition: 'background-color 0.3s ease'
                  }
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
            <Button
              startIcon={<AttachFile />}
              sx={{ 
                color: colors.secondaryText,
                transition: 'color 0.3s ease'
              }}
            >
              Attach
            </Button>
            <Button
              startIcon={<InsertPhoto />}
              sx={{ 
                color: colors.secondaryText,
                transition: 'color 0.3s ease'
              }}
            >
              Image
            </Button>
            <Button
              startIcon={<EmojiEmotions />}
              sx={{ 
                color: colors.secondaryText,
                transition: 'color 0.3s ease'
              }}
            >
              Emoji
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.divider}` }}>
          <Button 
            onClick={handleCloseNewThread}
            sx={{ 
              color: colors.secondaryText,
              transition: 'color 0.3s ease'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateThread}
            variant="contained"
            color="primary"
            disabled={!newThread.title.trim() || !newThread.content.trim()}
          >
            Post Discussion
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Thread Menu */}
      <Menu
        id="thread-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: colors.paper,
            boxShadow: colors.cardShadow,
            transition: 'all 0.3s ease'
          }
        }}
      >
        <MenuItem 
          onClick={handleMenuClose}
          sx={{ 
            color: colors.primaryText,
            transition: 'color 0.3s ease'
          }}
        >
          Save Post
        </MenuItem>
        <MenuItem 
          onClick={handleMenuClose}
          sx={{ 
            color: colors.primaryText,
            transition: 'color 0.3s ease'
          }}
        >
          Hide Post
        </MenuItem>
        <MenuItem 
          onClick={handleMenuClose}
          sx={{ 
            color: colors.primaryText,
            transition: 'color 0.3s ease'
          }}
        >
          Report
        </MenuItem>
      </Menu>
      
      {/* Footer - Modified to be at the bottom and centered */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto', // Push to bottom with flex layout
          borderTop: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          textAlign: 'center', // Center the text horizontally
          width: '100%' // Ensure full width
        }}
      >
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} CryptoPredict. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Forum;
