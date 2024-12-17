import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import browserHistory from '../../browser-history';
import { HistoryRouter } from '../history-route/history-route';
import { store } from '../../store';
import { AppRoute } from '../../const';
import { HomePage } from '../../pages/home-page/home-page';
import { PageNotFound } from '../../pages/page-not-found/page-not-found';
import PrivateRoute from '../private-route/private-route';
import { UserPage } from '../../pages/user-page/user-page';
import { MealPage } from '../../pages/meal-page/meal-page';
import { LandingPage } from '../../pages/landing-page/landing-page';
import { MealsByTypePage } from '../../pages/meals-by-type-page/meals-by-type-page';
import { Layout } from '../layout/layout';

function App() {
  return (
    <HelmetProvider>
      <HistoryRouter history={browserHistory} basename="/">
        <Provider store={store}>
          <Layout>
            <Routes>
              <Route path={AppRoute.Landing} element={<LandingPage/>}/>
              <Route path={AppRoute.Root} element={<PrivateRoute element={<HomePage/>}/>}/>
              <Route path={AppRoute.UserPage} element={<PrivateRoute element={<UserPage />} />}/>
              <Route path={AppRoute.MealPage} element={<PrivateRoute element={<MealPage />} />}/>
              <Route path={AppRoute.MealsByTypePage} element={<PrivateRoute element={<MealsByTypePage />} />}/>
              <Route path="*" element={<PageNotFound/>}/>
            </Routes>
          </Layout>
        </Provider>
      </HistoryRouter>
    </HelmetProvider>
  );
}

export default App;
