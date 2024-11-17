import { Helmet } from "react-helmet-async";
import { Layout } from "../../components/layout/layout";
import { UserItem } from "../../components/user-item/user-item";
import { FindMeal } from "../../components/find-meal/find-meal";

export function HomePage(): JSX.Element {
  return (
    <Layout>
      <Helmet>
        <title>Nutrition</title>
      </Helmet>
      <UserItem/>
      <FindMeal/>
    </Layout>
  );
}
