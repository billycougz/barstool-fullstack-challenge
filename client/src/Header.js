import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

function Header({ league, onLeagueChange }) {
  return (
    <AppBar position='static'>
      <Box display='flex'>
        <Toolbar>
          <Typography variant='h6'>Barstool Boxscores</Typography>
        </Toolbar>
        <Tabs value={league} onChange={onLeagueChange}>
          <Tab label='MLB' value='mlb' component={Link} to='/mlb' />
          <Tab label='NBA' value='nba' component={Link} to='/nba' />
        </Tabs>
      </Box>
    </AppBar>
  );
}

export default Header;
