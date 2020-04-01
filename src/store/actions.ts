// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { getFood, insertFood, patchFood } from "../database";
import { Food } from "../core";
import { RootAction, ThunkResult, ActionType } from "./types";
import {
  NEW_RECIPE,
  recipeFromState,
  actions as recipe_edit_actions,
} from "./recipe_edit";
import { brandedFoodFromState, NEW_BRANDED_FOOD } from "./branded_food_edit";
import { FoodRef } from "../core/FoodRef";

export function deselect(): RootAction {
  return { type: ActionType.DESELECT };
}

export function select(foodRef: FoodRef): RootAction {
  return { type: ActionType.SELECT_FOOD, foodRef };
}

export function updateFood(food: Food): RootAction {
  return { type: ActionType.UPDATE_FOOD, food };
}

export function newFood(foodId: string, food: Food): RootAction {
  return { type: ActionType.NEW_FOOD, foodId, food };
}

export function saveFood(): ThunkResult<Promise<void>> {
  return async (_, getState) => {
    const state = getState();
    const foodId = state.foodId;
    if (foodId == null) {
      throw "foodId was null.  This should never happen when saveFood is called.";
    }
    let food: Food;
    if (state.foodState?.stateType == "BrandedFoodEdit") {
      food = brandedFoodFromState(state.foodState);
    } else if (state.foodState?.stateType == "RecipeEdit") {
      food = recipeFromState(state.foodState);
    } else if (state.foodState?.stateType == "FoodView") {
      food = state.foodState.food;
    } else {
      throw "Illegal state: foodId was not null but was null";
    }
    await patchFood(foodId, food);
  };
}

export function selectAndLoad(foodRef: FoodRef): ThunkResult<Promise<void>> {
  return async (dispatch, getState) => {
    dispatch(select(foodRef));
    try {
      const food = await getFood(foodRef.foodId);
      if (getState().foodId != foodRef.foodId) {
        return;
      }
      dispatch(updateFood(food));
      if (food.dataType != "Recipe") {
        return;
      }
      await Promise.all(
        food.ingredientsList.map((ingredient, index) => {
          dispatch(
            recipe_edit_actions.loadIngredient(index, ingredient.foodId)
          );
        })
      );
    } catch (err) {
      // TODO: display a warning to user.
      console.log(err);
    }
  };
}

export function newBrandedFood(): ThunkResult<Promise<void>> {
  return async (dispatch) => {
    const foodId = await insertFood(NEW_BRANDED_FOOD);
    dispatch(newFood(foodId, NEW_BRANDED_FOOD));
  };
}

export function newRecipe(): ThunkResult<Promise<void>> {
  return async (dispatch) => {
    const foodId = await insertFood(NEW_RECIPE);
    dispatch(newFood(foodId, NEW_RECIPE));
  };
}
