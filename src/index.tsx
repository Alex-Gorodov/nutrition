import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.sass';
import App from './components/app/App';
import { store } from './store';
import { fetchMealsAction, fetchUsersAction } from './store/api-actions';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

store.dispatch(fetchUsersAction());
store.dispatch(fetchMealsAction());


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
