export function formatRecipe(recipe: string): string {
  const stepPattern = /(\d+\.\s)/g;
  const steps = recipe.split(stepPattern).filter((step) => step.trim() !== "");

  let formattedRecipe = "";
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].match(stepPattern)) {
      formattedRecipe += (i > 0 ? "\n" : "") + steps[i];
    } else {
      formattedRecipe += steps[i]  + "\n";
    }
  }

  return formattedRecipe;
}
