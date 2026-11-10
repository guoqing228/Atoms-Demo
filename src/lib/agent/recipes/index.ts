import type { Recipe } from "./_kit";
import { todoRecipe } from "./todo";
import { kanbanRecipe } from "./kanban";
import { notesRecipe } from "./notes";
import { pomodoroRecipe } from "./pomodoro";
import { expenseRecipe } from "./expense";
import { habitRecipe } from "./habit";
import { quizRecipe } from "./quiz";
import { game2048Recipe } from "./game-2048";
import { dashboardRecipe } from "./dashboard";
import { landingRecipe } from "./landing";
import { chatRecipe } from "./chat";
import { calculatorRecipe } from "./calculator";
import { musicRecipe } from "./music";

/**
 * Registration order matters only for tie-breaking: earlier recipes win when
 * two recipes match the prompt with the same score.
 */
export const RECIPES: Recipe[] = [
  todoRecipe,
  kanbanRecipe,
  notesRecipe,
  pomodoroRecipe,
  expenseRecipe,
  habitRecipe,
  quizRecipe,
  game2048Recipe,
  dashboardRecipe,
  landingRecipe,
  chatRecipe,
  calculatorRecipe,
  musicRecipe,
];

export function recipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}
