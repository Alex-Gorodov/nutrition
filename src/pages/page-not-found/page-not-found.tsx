import { Link } from "react-router-dom";
import { Layout } from "../../components/layout/layout";
import { AppRoute } from "../../const";
import { Helmet } from "react-helmet-async";

export function PageNotFound(): JSX.Element {
  return (
    <Layout>
      <Helmet>
        <title>Nutrition | 404</title>
      </Helmet>
      <div className="not-found">
        <h1 className="title title--1">
          404
        </h1>
        <h1 className="title title--2">
          Page not found
        </h1>
        <Link to={AppRoute.Root} className="button">
          Go to main
        </Link>
      </div>
    </Layout>
  )
}
