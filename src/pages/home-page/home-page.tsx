import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { ChooseMeal } from "../../components/choose-meal/choose-meal";
import { ChooseTraining } from "../../components/choose-training/choose-training";
import { Helmet } from "react-helmet-async";

export function HomePage(): JSX.Element {
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);

  return (
    <>
      <Helmet>
        <title>Nutrition</title>
      </Helmet>
      <ChooseMeal />
      {!activeMeal && <ChooseTraining />}
    </>
  );
}
