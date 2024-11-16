import { Helmet } from "react-helmet-async";
import { Layout } from "../../components/layout/layout";

export function HomePage(): JSX.Element {
  return (
    <Layout>
      <Helmet>
        <title>Nutrition</title>
      </Helmet>
      <p className="title title--2">fgsd</p>
    </Layout>
  );
}
