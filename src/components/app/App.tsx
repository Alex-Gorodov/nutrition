import { HelmetProvider } from 'react-helmet-async';
import logo from './logo.svg';
import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import browserHistory from '../../browser-history';
import { HistoryRouter } from '../history-route/history-route';
import { store } from '../../store';
import { AppRoute } from '../../const';
import { HomePage } from '../../pages/home-page/home-page';
import { PageNotFound } from '../../pages/page-not-found/page-not-found';

function App() {
  return (
    <HelmetProvider>
      <HistoryRouter history={browserHistory} basename="/">
        <Provider store={store}>
          <Routes>
            <Route path={AppRoute.Root} element={<HomePage/>}/>
            {/* <Route path={AppRoute.UserPage} element={<PrivateRoute element={<UserPage />} />}/> */}
            <Route path="*" element={<PageNotFound/>}/>
          </Routes>
        </Provider>
      </HistoryRouter>
    </HelmetProvider>
  );
}

export default App;
