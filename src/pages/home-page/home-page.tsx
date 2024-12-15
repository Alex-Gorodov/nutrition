import { Helmet } from "react-helmet-async";
import { Layout } from "../../components/layout/layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { AuthorizationStatus } from "../../const";
import { ChooseMeal } from "../../components/choose-meal/choose-meal";
import { ChooseTraining } from "../../components/choose-training/choose-training";
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
// import { fetchOpenAIResponse } from "../../utils/fetchOpenAIResponse";
// import { useEffect, useState } from "react";

export function HomePage(): JSX.Element {
  // const [response, setResponse] = useState<string | null>(null);
  // const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);

  const authorizationStatus = useSelector((state: RootState) => state.auth.authorizationStatus);
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);
  const isMealsLoading = false;
  // const isMealsLoading = useSelector((state: RootState) => state.data.isMealsDataLoading);

  const auth = authorizationStatus === AuthorizationStatus.Auth;

  // useEffect(() => {
  //   const getResponse = async () => {
  //     setIsResponseLoading(true);
  //     try {
  //       const apiResponse = await fetchOpenAIResponse("Привет! Ты работаешь?");
  //       setResponse(apiResponse);
  //     } catch (error) {
  //       console.error("Ошибка при вызове OpenAI API:", error);
  //       setResponse("Ошибка получения ответа.");
  //     } finally {
  //       setIsResponseLoading(false);
  //     }
  //   };

  //   getResponse();
  // }, []);

  return (
    <Layout>
      <Helmet>
        <title>Nutrition</title>
      </Helmet>
      {
        !auth || isMealsLoading ? (
          <div className="loading-wrapper">
            <LoadingSpinner size={"80"} />
            <p>Загрузка данных...</p>
          </div>
        ) : (
          <>
            <ChooseMeal />
            {!activeMeal && <ChooseTraining />}
          </>
        )
      }
      {/* <div className="api-response">
        {isResponseLoading ? (
          <LoadingSpinner size={"40"} />
        ) : (
          <p>Ответ от OpenAI: {response}</p>
        )}
      </div> */}
    </Layout>
  );
}
