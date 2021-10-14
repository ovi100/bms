import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import dbRef from '../../firebase';
import Navigation from '../navigation/Navigation';
import HeaderMargin from '../navigation/HeaderMargin';
import { Box, Paper, Grid, TextField, Button } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initState = {
  name: '',
  flat_no: '',
  unit_price: '',
  present_unit: '',
  previous_unit: '',
  bill_status: 'Due'
}

const AddEditBill = () => {
  let [state, setState] = useState(initState);
  const [bill, setBill] = useState({});
  const [date, setDate] = useState(new Date());
  let [flatNo, setFlatNo] = useState([]);

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {

    dbRef.child('ebills').on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        setBill({ ...snapshot.val() });
      }
      else {
        setBill({});
      }
    });

    return () => {
      setBill({});
    }

  }, [id]);

  useEffect(() => {

    dbRef.child('ebills').on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        const snapValue = snapshot.val();
        const arrData = Object.keys(snapValue).map((key) => {
          return { ...snapValue[key] }
        });
        console.log(arrData);
        //const flatData = arrData.map(element => element.flat_no);
        setFlatNo(arrData);
      }
    });

  }, []);

  console.log("Flat No", flatNo);

  useEffect(() => {
    if (id) {
      setState({ ...bill[id] });
    }
    else {
      setState({ ...initState });
    }

    return () => {
      setState({ ...initState });
    };
  }, [id, bill]);

  const { name, flat_no, unit_price, present_unit, previous_unit } = state;

  const inputChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  }

  const addBill = (e) => {
    e.preventDefault();

    const new_date = new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const unit_used = parseInt(present_unit) - parseInt(previous_unit);
    const total_bill = parseInt(unit_used) * parseInt(unit_price);

    state = Object.assign(state, {
      date: new_date,
      unit_used: unit_used,
      total_bill: total_bill
    });

    console.log('New State', state);

    if (flatNo.find(item => item.flat_no === state.flat_no)) {
      toast.error('Flat already rented', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        className: 'Toastify__toast-theme--colored',
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      return;
    }

    if (!id) {

      dbRef.child('ebills').push(state, (error) => {
        if (error) {
          alert(error);
        } else {
          toast.success('Bill Added Successfully!', {
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
    else {
      dbRef.child(`ebills/${id}`).set(state, (error) => {
        if (error) {
          alert(error);
        } else {
          toast.success('Bill Info Updated Successfully!', {
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

    setTimeout(() => history.push("/"), 4000);
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Navigation />
        <Box component="main" sx={{ p: 3 }}>
          <ToastContainer transition={Slide} />
          <HeaderMargin />
          <h2>{id ? "EDIT BILL" : "ADD BILL"}</h2>
          <form onSubmit={addBill}>
            <Paper elevation={2} sx={{ flexGrow: 1, p: 3 }}>
              <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 12, md: 12 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Renter Name"
                    variant="outlined"
                    name="name"
                    value={name || ""}
                    onChange={inputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Flat No."
                    variant="outlined"
                    name="flat_no"
                    value={flat_no || ""}
                    onChange={inputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Present Unit"
                    variant="outlined"
                    name="present_unit"
                    value={present_unit || ""}
                    onChange={inputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Previous Unit"
                    variant="outlined"
                    name="previous_unit"
                    value={previous_unit || ""}
                    onChange={inputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Unit Price"
                    variant="outlined"
                    name="unit_price"
                    value={unit_price || ""}
                    onChange={inputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select date"
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Button variant="outlined" type="submit" sx={{ p: 1 }}>{id ? "Update" : "Add Bill"}</Button>
                </Grid>
              </Grid>
            </Paper>
          </form>
        </Box>
      </Box>
    </>
  )
}

export default AddEditBill
