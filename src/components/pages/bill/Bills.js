import React from 'react';
import Box from '@mui/material/Box';
import Navigation from '../../navigation/Navigation';
import HeaderMargin from '../../navigation/HeaderMargin';
import BillList from './BillList';

const Bills = () => {

    return (
        <Box sx={{ display: 'flex' }}>
            <Navigation />
            <HeaderMargin />
            <BillList />
        </Box>
    );
}

export default Bills
