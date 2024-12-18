export function formatRecipe(recipe: string): string {
  const rawSteps = recipe.split(/(?=\d+[\.\)])\s*/);

  let formattedRecipe = "";

  rawSteps.forEach((step) => {
    const cleanedStep = step.replace(/^\d+[\.\)]\s*/, '').trim();

    if (cleanedStep) {
      formattedRecipe += `${cleanedStep}\n`;
    }
  });

  return formattedRecipe.trim();
}
