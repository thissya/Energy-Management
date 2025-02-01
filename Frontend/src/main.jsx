import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
