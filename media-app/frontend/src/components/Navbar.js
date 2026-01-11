import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, TextField, Box, Tooltip, Avatar } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#ADD8E6', color: '#000', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#000', fontSize: '24px', fontWeight: 'bold' }}>
          Raisbook
        </Link>

        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, mx: 3 }}>
          <TextField
            size="small"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '300px', backgroundColor: '#f0f0f0', borderRadius: '20px' }}
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <NotificationBell />
              <Button color="inherit" component={Link} to="/chat">
                💬 Messages
              </Button>
              <Tooltip title={`${user.username} (${user.role})`}>
                <Box
                  component={Link}
                  to="/profile"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  <Avatar
                    src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : ''}
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: '#1976d2',
                      fontSize: '16px',
                      marginRight: 1
                    }}
                  >
                    {!user.profilePicture && user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
              </Tooltip>
              {user.role === 'creator' && (
                <Button color="inherit" component={Link} to="/upload">
                  Upload
                </Button>
              )}
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
