import React, { useState, useEffect } from 'react';
import dbRef from '../../firebase';
import Navigation from '../navigation/Navigation';
import HeaderMargin from '../navigation/HeaderMargin';
import { Box, Grid, Paper } from '@mui/material';
import Chart from 'react-apexcharts'

const ChartReport = () => {
  const [bills, setBills] = useState([]);
  const [flats, setFlats] = useState([]);
  const [flatsBill, setFlatsBill] = useState([]);
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

    const flat_label = bills.map(bill => bill.flat_no);
    setFlats(flat_label.sort());

    const total_arr = bills.map(bill => bill.total_bill);
    setFlatsBill(total_arr);
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

  console.log(flats);

  // React Apex Pie Chart

  const apexPie = {
    series: [paidBills, dueBills],
    options: {
      chart: {
        type: 'pie'
      },
      labels: ['Paid', 'Due', `Total Bills: ${totalBills} Tk`, 'Currency in Taka']
    }
  };

  // React Apex Pie Chart

  const apexColumn = {
    series: [{
      name: 'Bill',
      data: flatsBill
    }],
    options: {
      chart: {
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: flats
      },
      yaxis: {
        title: {
          text: 'Tk (bill amounts)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " Tk"
          }
        }
      },
      title: {
        text: 'Bill by flat name',
        position: 'bottom'
      }
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Navigation />
        <HeaderMargin />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <HeaderMargin />
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} sm={6} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Chart options={apexPie.options} series={apexPie.series} type="pie" width={675} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Chart options={apexColumn.options} series={apexColumn.series} type="bar" />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default ChartReport
