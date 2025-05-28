import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Menu,
  MenuItem,
  Fade,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Menu as MenuIcon,
  TrendingUp as FinancialIcon,
  Help as GeneralIcon,
  Add as AddIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';

const ChatInterface = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI Financial Assistant. I can help you with financial analysis, market insights, and general queries. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Financial Analysis');
  const [optionMenuAnchor, setOptionMenuAnchor] = useState(null);
  const [chatHistory] = useState([
    'Previous Chat 1',
    'Market Analysis Discussion',
    'Portfolio Review',
    'Investment Strategy'
  ]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const analysisOptions = [
    { value: 'Financial Analysis', icon: <FinancialIcon />, color: '#4CAF50' },
    { value: 'General Query', icon: <GeneralIcon />, color: '#2196F3' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Replace with your Flask API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          option: selectedOption 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response || 'I apologize, but I couldn\'t process your request at the moment. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: 'I\'m experiencing some technical difficulties. Please check your connection and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setOptionMenuAnchor(null);
  };

  const selectedOptionData = analysisOptions.find(opt => opt.value === selectedOption);

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex',
      bgcolor: '#0a0a0a',
      color: 'white'
    }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRight: '1px solid #333'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              color: 'white',
              borderColor: '#333',
              '&:hover': {
                borderColor: '#555',
                bgcolor: alpha('#fff', 0.05)
              }
            }}
          >
            New Chat
          </Button>
        </Box>
        
        <Divider sx={{ borderColor: '#333' }} />
        
        <List sx={{ flex: 1, px: 1 }}>
          {chatHistory.map((chat, index) => (
            <ListItem 
              key={index}
              button
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  bgcolor: alpha('#fff', 0.05)
                }
              }}
            >
              <ListItemIcon sx={{ color: '#888', minWidth: 36 }}>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText 
                primary={chat}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  noWrap: true
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2,
            bgcolor: '#0a0a0a',
            // borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
            
            <Avatar sx={{ bgcolor: '#2196F3' }}>
              <BotIcon />
            </Avatar>
            
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              QJ AI Assistant
            </Typography>
          </Box>

          {/* Option Selection */}
          <Button
            variant="outlined"
            endIcon={<ArrowDownIcon />}
            onClick={(e) => setOptionMenuAnchor(e.currentTarget)}
            sx={{
              color: selectedOptionData?.color,
              borderColor: selectedOptionData?.color,
              '&:hover': {
                borderColor: selectedOptionData?.color,
                bgcolor: alpha(selectedOptionData?.color || '#fff', 0.1)
              }
            }}
          >
            {selectedOptionData?.icon}
            <Typography sx={{ ml: 1 }}>{selectedOption}</Typography>
          </Button>

          <Menu
            anchorEl={optionMenuAnchor}
            open={Boolean(optionMenuAnchor)}
            onClose={() => setOptionMenuAnchor(null)}
            PaperProps={{
              sx: {
                bgcolor: '#1a1a1a',
                border: '1px solid #333'
              }
            }}
          >
            {analysisOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: alpha(option.color, 0.1)
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: option.color }}>
                  {option.icon}
                  <Typography>{option.value}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Paper>

        {/* Messages Container */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto',
            px: 2,
            pt: 2,
            pb: 16,
            background: '#0a0a0a',    //'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            maxWidth: 900,
            mx: 'auto'
          }}
        >
          {messages.map((message) => (
            <Fade in={true} key={message.id}>
              <Box
                sx={{
                  display: 'flex',
                  mb: 3,
                  flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 2
                }}
              >
                {/* Avatar */}
                <Avatar
                  sx={{
                    bgcolor: message.type === 'user' ? '#4CAF50' : '#2196F3',
                    boxShadow: message.type === 'user' 
                      ? '0 0 20px rgba(76, 175, 80, 0.3)' 
                      : '0 0 20px rgba(33, 150, 243, 0.3)'
                  }}
                >
                  {message.type === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>

                {/* Message Content */}
                <Box sx={{ maxWidth: '70%' }}>
                  <Paper
                    elevation={2}
                    sx={{
                    p: 2,
                    bgcolor: message.type === 'user' ? '#4a5568' : '#2d3748',
                    color: '#f0f0f0',
                    textAlign: message.type === 'user' ? 'right' : 'left',
                    borderRadius: 3,
                    p: 2,
                    maxWidth: '75%',
                    mb: 1,
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Paper>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#888',
                      mt: 0.5,
                      display: 'block',
                      textAlign: message.type === 'user' ? 'right' : 'left'
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
              </Box>
            </Fade>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <Fade in={true}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#2196F3' }}>
                  <BotIcon />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: '#2a2a2a',
                    borderRadius: 2,
                    border: '1px solid #333'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: '#2196F3' }} />
                    <Typography variant="body2" sx={{ color: '#888' }}>
                      {/* Thinking... */}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Fade>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area - Fixed at bottom */}
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: '#0a0a0a',
            // borderTop: '1px solid #333',
            zIndex: 1000
          }}
        >
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                ref={inputRef}
                fullWidth
                multiline
                maxRows={4}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                disabled={isLoading}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#0a0a0a',
                    color: 'white',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#555',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                    },
                  }
                }}
              />
              
              <IconButton
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                sx={{
                  bgcolor: '#2196F3',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#1976D2',
                  },
                  '&:disabled': {
                    bgcolor: '#333',
                    color: '#666'
                  },
                  p: 1.5
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#666',
                mt: 1,
                display: 'block',
                textAlign: 'center'
              }}
            >
              Press Enter to send • Shift+Enter for new line
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatInterface;














// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Bot, User } from 'lucide-react';
// import {
//   AppBar,
//   Box,
//   Toolbar,
//   Typography,
//   Avatar,
//   Container,
//   Paper,
//   TextField,
//   IconButton,
//   CircularProgress,
// } from '@mui/material';

// const ChatInterface = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: 'bot',
//       content: "Hello! I'm your AI assistant. How can I help you today?",
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage = {
//       id: messages.length + 1,
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     const currentInput = inputMessage;
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: currentInput }),
//       });

//       const data = await response.json();

//       const botMessage = {
//         id: messages.length + 2,
//         type: 'bot',
//         content: data.response || "Sorry, I didn't understand that.",
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error:', error);
//       const errorMessage = {
//         id: messages.length + 2,
//         type: 'bot',
//         content:
//           "Sorry, I'm having trouble connecting. Please try again later.",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const formatTime = (date) =>
//     date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   return (
//     <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.900', color: 'white' }}>
//       {/* Header */}
//       <AppBar position="static" sx={{ bgcolor: 'grey.800' }}>
//         <Toolbar>
//           <Bot style={{ marginRight: 8, color: '#60a5fa' }} />
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             AI Assistant
//           </Typography>
//           <Typography variant="body2" color="gray">
//             Online
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Message List */}
//       <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
//         {messages.map((message) => (
//           <Box
//             key={message.id}
//             sx={{
//               display: 'flex',
//               flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
//               alignItems: 'flex-start',
//               gap: 2,
//               mb: 2,
//             }}
//           >
//             <Avatar sx={{ bgcolor: message.type === 'user' ? 'primary.main' : 'grey.700' }}>
//               {message.type === 'user' ? <User size={18} /> : <Bot size={18} />}
//             </Avatar>
//             <Box sx={{ maxWidth: '70%' }}>
//               <Paper
//                 elevation={2}
//                 sx={{
//                   p: 2,
//                   bgcolor: message.type === 'user' ? 'primary.main' : 'grey.700',
//                   color: 'white',
//                   textAlign: message.type === 'user' ? 'right' : 'left',
//                 }}
//               >
//                 <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
//               </Paper>
//               <Typography variant="caption" color="gray" sx={{ mt: 0.5, textAlign: message.type === 'user' ? 'right' : 'left' }}>
//                 {formatTime(message.timestamp)}
//               </Typography>
//             </Box>
//           </Box>
//         ))}

//         {isLoading && (
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//             <Avatar sx={{ bgcolor: 'grey.700' }}>
//               <Bot size={18} />
//             </Avatar>
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <CircularProgress size={10} color="inherit" />
//               <CircularProgress size={10} color="inherit" />
//               <CircularProgress size={10} color="inherit" />
//             </Box>
//           </Box>
//         )}

//         <div ref={messagesEndRef} />
//       </Box>

//       {/* Input Area */}
//       <Box
//         component="form"
//         onSubmit={(e) => {
//           e.preventDefault();
//           sendMessage();
//         }}
//         sx={{
//           px: 2,
//           py: 1,
//           borderTop: '1px solid #333',
//           bgcolor: 'grey.900',
//         }}
//       >
//         <Container maxWidth="md">
//           <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
//             <TextField
//               fullWidth
//               multiline
//               inputRef={inputRef}
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="Type your message here..."
//               disabled={isLoading}
//               variant="outlined"
//               InputProps={{
//                 sx: {
//                   bgcolor: 'grey.800',
//                   color: 'white',
//                 },
//               }}
//             />
//             <IconButton
//               type="submit"
//               color="primary"
//               disabled={!inputMessage.trim() || isLoading}
//               sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
//             >
//               <Send size={20} />
//             </IconButton>
//           </Box>
//           <Typography variant="caption" color="gray" align="center" display="block" mt={1}>
//             Press Enter to send, Shift+Enter for new line
//           </Typography>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default ChatInterface;