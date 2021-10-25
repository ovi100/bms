import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dbRef from '../../firebase';
import Navigation from '../navigation/Navigation';
import HeaderMargin from '../navigation/HeaderMargin';
import {
  Box, Paper, Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination
} from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

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

const Invoices = () => {

  const [bills, setBills] = useState([]);
  const [dueBills, setDueBills] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        //console.log(snapshot.val());
        const snapValue = snapshot.val();
        const newData = Object.keys(snapValue).map((key) => {
          return { id: key, ...snapValue[key] }
        })
        //console.log(newData);
        setBills(newData);
      }
    });

  }, []);

  // Calculating the bills
  useEffect(() => {
    const due_bills = bills.filter(bill => bill.bill_status === 'Due');
    setDueBills(due_bills);

  }, [bills]);

  console.log(bills);
  console.log(dueBills);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Navigation />
        <HeaderMargin />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <HeaderMargin />
          {/* Data table Start */}
          {
            dueBills.length > 0 ?
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
                      {dueBills
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
                                <Link to={`/create_invoice/${bill.id}`}>
                                  <Button variant="outlined" sx={{ p: 1, mr: 2 }}><ControlPointIcon /></Button>
                                </Link>
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
      </Box>
    </>
  )
}

export default Invoices
