import React from 'react';
import { BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Home from './components/pages/home/Home';
import AddEditBill from './components/pages/bill/AddEditBill';
import Bills from './components/pages/bill/Bills';
import Invoices from './components/pages/invoice/Invoices';
import CreateInvoice from './components/pages/invoice/CreateInvoice';
import ChartReport from './components/pages/ChartReport';
import './style.css';

function App() {
  return (
    <>
      <Router>
          <Switch>
              <Route exact path="/" component={Home}/>
              <Route  path="/add_bill" component={AddEditBill}/>
              <Route  path="/edit/:id" component={AddEditBill}/>
              <Route  path="/bills" component={Bills}/>
              <Route  path="/invoices" component={Invoices}/>
              <Route  path="/create_invoice/:id" component={CreateInvoice}/>
              <Route  path="/chart_report" component={ChartReport}/>
          </Switch>
      </Router>
    </>
  );
}

export default App;
