import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import App from './App.js';
import NameThatObject from './components/NameThatObject.js';


const routes = (
	<Router history={browserHistory}>
	    <Route path="/" component={App}>
	    	<Route path="name-that-object" component={NameThatObject} />
	    </Route>
	</Router>
);

export default routes;