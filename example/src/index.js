import React from 'react'
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Switch, Route, Redirect
} from "react-router-dom";
import { StoreContext } from 'storeon/react';
import App from './App';
import { store } from "./store";


ReactDOM.render(
  <StoreContext.Provider value={store}>
    <Router>
      <Switch>
        <Route path='/:locale'>
          <Switch>
            <Route
              path={'*'}
              render={(props) => <App {...props} />}
            />
          </Switch>
        </Route>
        <Redirect to='/ru' />
      </Switch>
    </Router>
  </StoreContext.Provider>
  , document.getElementById('root')
)
