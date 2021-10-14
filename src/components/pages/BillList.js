import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import dbRef from '../../firebase';
import HeaderMargin from '../navigation/HeaderMargin';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box, Grid, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const columns = [
  { field: 'symbol', value: '#', width: 70 },
  { field: 'renterName', value: 'Renter name', width: 130 },
  { field: 'flatName', value: 'Flat name', width: 130 },
  { field: 'date', value: 'Date', width: 90 },
  { field: 'unitUsed', value: 'Unit used(Kw)', type: 'number', width: 90 },
  { field: 'totalBill', value: 'Total bill(Tk)', type: 'number', width: 90 },
  { field: 'billStatus', value: 'Bill status', width: 90 },
  { field: 'actions', value: 'Actions', width: 90 }
];

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [totalBills, setTotalBills] = useState(0);
  const [dueBills, setDueBills] = useState(0);
  const [paidBills, setPaidBills] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const location = useLocation();

  const homePage = location.pathname === '/';

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  const deleteItem = (id) => {

    dbRef.child(`ebills/${id}`).remove((error) => {
      if (error) {
        alert(error);
      } else {
        toast.success('Data removed successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          className: 'Toastify__toast-theme--colored',
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    });
  }

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <ToastContainer transition={Slide} />
        {
          homePage ?
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} sm={2} md={3}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <AttachMoneyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Total Bill" secondary={`৳ ${totalBills}`} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={2} md={3}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <AttachMoneyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Paid Bill" secondary={`৳ ${paidBills}`} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={2} md={3}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <AttachMoneyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Due Bill" secondary={`৳ ${dueBills}`} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={2} md={3}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <HomeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="House Rented" secondary="4 Flat" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
            :
            <HeaderMargin />
        }
        {/* Data table Start */}
        {
          bills.length > 0 ?
            <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', mt: 3 }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          style={{ minWidth: column.width }}
                        >
                          {column.value}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bills
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((bill, index) => {
                        return (
                          <TableRow
                            key={bill.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">{index + 1}</TableCell>
                            <TableCell component="th" scope="row">{bill.name}</TableCell>
                            <TableCell>{bill.flat_no}</TableCell>
                            <TableCell>{bill.date}</TableCell>
                            <TableCell>{bill.unit_used}</TableCell>
                            <TableCell>{bill.total_bill}</TableCell>
                            <TableCell>{bill.bill_status}</TableCell>
                            <TableCell>
                              <Link to={`/edit/${bill.id}`}>
                                <Button variant="outlined" sx={{ p: 1, mr: 2 }}><EditIcon /></Button>
                              </Link>
                              <Button variant="outlined" onClick={() => deleteItem(bill.id)} sx={{ p: 1 }}><DeleteOutlineIcon /></Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              {
                bills.length > 5 ?
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={bills.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                  :
                  null
              }
            </Paper>
            :
            null
        }
      </Box>
    </>
  )
}

export default BillList;
