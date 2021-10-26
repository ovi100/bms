import React, { useState, useEffect } from 'react';
import dbRef from '../../firebase';
import Navigation from '../navigation/Navigation';
import HeaderMargin from '../navigation/HeaderMargin';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';

const ChartReport = () => {

  const [bills, setBills] = useState([]);
  const [totalBills, setTotalBills] = useState(0);
  const [dueBills, setDueBills] = useState(0);
  const [paidBills, setPaidBills] = useState(0);

  // Get the data from database
  useEffect(() => {

    dbRef.child('ebills').on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        console.log(snapshot.val());
        const snapValue = snapshot.val();
        const newData = Object.keys(snapValue).map((key) => {
          return { id: key, ...snapValue[key] }
        })
        console.log(newData);
        setBills(newData);
      }
    });

  }, []);

  console.log(bills);

  // Calculating the bills
  useEffect(() => {
    const total_arr = bills.map(bill => bill.total_bill);
    const total_sum = total_arr.reduce((a, b) => a + b, 0);
    setTotalBills(total_sum);

    const paid_bills = bills.filter(bill => bill.bill_status === 'Paid');
    const paid_arr = paid_bills.map(bill => bill.total_bill);
    const paid_sum = paid_arr.reduce((a, b) => a + b, 0);
    setPaidBills(paid_sum);

    const due_bills = bills.filter(bill => bill.bill_status === 'Due');
    const due_arr = due_bills.map(bill => bill.total_bill);
    const due_sum = due_arr.reduce((a, b) => a + b, 0);
    setDueBills(due_sum);

  }, [bills]);

  const data = {
    labels: ['Total', 'Paid', 'Due'],
    datasets: [
      {
        data: [totalBills, paidBills, dueBills],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Navigation />
        <HeaderMargin />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <HeaderMargin />
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} sm={4} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom component="div">
                  Bill Status(React Chart Js 2)
                </Typography>
                <Pie data={data} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>

              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>

              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default ChartReport
