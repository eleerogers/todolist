import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './index.css';
import App from './App';


if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/:list">
          <App />
        </Route>
        <Route path="/">
          <App />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
