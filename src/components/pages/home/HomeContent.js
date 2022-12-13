import React from 'react';
import { Box } from '@mui/material';
import HeaderMargin from '../../navigation/HeaderMargin';
import BillList from '../bill/BillList';

const HomeContent = () => {
  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <HeaderMargin />
        <BillList />
      </Box>
    </>
  )
}

export default HomeContent
