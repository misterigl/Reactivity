import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app.jsx';
import NotFound from './components/NotFound.jsx';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    </Route>
    <Route path="*" component={NotFound} />
  </Router>, document.getElementById('app'));
