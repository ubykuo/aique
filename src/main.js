import React from 'react';
import { render } from 'react-dom';

// Routes
import routes from './routes';

render(
  routes,
  document.getElementById('container')
);