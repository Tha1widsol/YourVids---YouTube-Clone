import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {store} from './app/store';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

let persistor = persistStore(store)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store = {store}>
      <PersistGate loading = {<h2>Loading...</h2>} persistor = {persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
