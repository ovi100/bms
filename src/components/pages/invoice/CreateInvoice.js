import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import dbRef from '../../../firebase';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '../../navigation/Navigation';
import HeaderMargin from '../../navigation/HeaderMargin';
import { Box, Paper, Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './invoice.css';


const CreateInvoice = () => {
  let [state, setState] = useState([]);
  const { id } = useParams();

  // Get the data from database
  useEffect(() => {

    dbRef.child(`ebills/${id}`).on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        const snapValue = snapshot.val();
        setState(snapValue);
      }
    });

  }, [id]);

  console.log(state);

  const { name, flat_no, date, present_unit, previous_unit, unit_used, total_bill } = state;
  const new_date = new Date(date).getDate() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getFullYear();

  const payBill = (e) => {
    e.preventDefault();

    state = Object.assign(state, {
      bill_status: 'Paid'
    });

    console.log('New State', state);

    dbRef.child(`ebills/${id}`).set(state, (error) => {
      if (error) {
        alert(error);
      } else {
        toast.success('Payment Taken Successfully!', {
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
      <Box sx={{ display: 'flex' }}>
        <Navigation />
        <HeaderMargin />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <ToastContainer transition={Slide} />
          <HeaderMargin />
          <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', mt: 3 }}>
            <div className="new-invoice">
              <form className="invoice-form" onSubmit={payBill}>
                <div className="invoice-header">
                  <div className="logo">
                    <HomeWorkIcon />
                    <h4>SS Tower</h4>
                  </div>
                  <div className="invoice-info">
                    <h4>Invoice No: #{`${flat_no}-${new_date}`}</h4>
                    <h4>Issue Date: {new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()}</h4>
                  </div>
                </div>
                <div className="sender-receiver">
                  <div className="sender">
                    <h4>Invoice From</h4>
                    <p>Md. Abu Sayed</p>
                    <p>18/A Sonamia Bazar, Adamjeenagar</p>
                    <p>Narayngonj, Dhaka</p>
                  </div>
                  <div className="receiver">
                    <h4>Invoice To</h4>
                    <p>{name}</p>
                    <p>Flat No: {flat_no}</p>
                  </div>
                </div>
                <div className="payment-method">
                  <h4>Payment Method</h4>
                  <FormControl component="fieldset">
                    <RadioGroup defaultValue="cash">
                      <FormControlLabel value="bank" control={<Radio />} label="Bank Transfer" />
                      <FormControlLabel value="bkash" control={<Radio />} label="Bkash" />
                      <FormControlLabel value="nagad" control={<Radio />} label="Nagad" />
                      <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="form-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Units</th>
                        <th>Units Used</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Present Units</td>
                        <td>{present_unit}</td>
                        <td rowSpan="2">{unit_used}</td>
                        <td rowSpan="2">{unit_used} x 10 = {total_bill}</td>
                      </tr>
                      <tr>
                        <td>Previous Units</td>
                        <td>{previous_unit}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="pay-button">
                  <Button variant="outlined" type="submit" sx={{ p: 1, mr: 1 }}> <CheckCircleOutlineIcon /> Pay Bill</Button>
                  <Button variant="outlined" onClick={()=>window.print()} sx={{ p: 1 }}> <PrintIcon /> Print</Button>
                </div>
              </form>
            </div>
          </Paper>
        </Box>
      </Box>
    </>
  )
}

export default CreateInvoice
