export function formatRecipe(recipe: string): string {
  const stepPattern = /\d+(\.|\))\s/g; // Захват номера шага с точкой или скобкой
  const rawSteps = recipe.split(stepPattern).filter((step) => step.trim() !== ""); // Убираем пустые строки

  let formattedRecipe = "";
  let currentStepNumber = 0;

  for (const step of rawSteps) {
    const trimmedStep = step.trim();

    // Пропускаем шаги, которые содержат только закрывающую скобку или пустую строку
    if (trimmedStep === ")" || trimmedStep === ".") {
      continue;
    }

    // Увеличиваем номер шага только для содержательных строк
    currentStepNumber++;
    formattedRecipe += `${currentStepNumber}. ${trimmedStep}\n`;
  }

  return formattedRecipe.trim(); // Убираем лишние переносы
}
