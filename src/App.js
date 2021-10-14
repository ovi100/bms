import React from 'react';
import { BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Home from './components/pages/Home';
import AddEditBill from './components/pages/AddEditBill';
import Bills from './components/pages/Bills';
import './style.css';

function App() {
  return (
    <>
      <Router>
          <Switch>
              <Route exact path="/" component={Home}/>
              <Route  path="/add" component={AddEditBill}/>
              <Route  path="/edit/:id" component={AddEditBill}/>
              <Route  path="/bills" component={Bills}/>
          </Switch>
      </Router>
    </>
  );
}

export default App;
