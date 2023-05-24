//usar o index.jsx dentro de frontende/src como padrao
//usar o index.js dentro de backend/src como padrao

// Path: src/frontend/src/index.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/frontend/src/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

