import React from 'react';
import Box from '@mui/material/Box';
import Navigation from '../../navigation/Navigation';
import HomeContent from './HomeContent';


const Home = () => {

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
      <HomeContent />
    </Box>
  );
}

export default Home;
