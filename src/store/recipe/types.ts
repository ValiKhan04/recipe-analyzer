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
import { FoodRef } from "../../../core/FoodRef";
import { NormalizedFood } from "../../../core/NormalizedFood";
import { Quantity } from "../../../core/Quantity";

export interface State {
  description: string,
  ingredients: {
    quantity: Quantity,
    foodId: string,
    deselected: boolean,
  }[];
  foodsById: {[index: string]: NormalizedFood};
}

export enum ActionType {
  UPDATE_DESCRIPTION = '@recipe/UpdateDescription',
  SET_FOOD_FOR_ID = '@recipe/SetFoodForId',
  ADD_INGREDIENT = '@recipe/AddIngredient',
  UPDATE_INGREDIENT_AMOUNT = '@recipe/UpdateIngredientAmount',
  UPDATE_INGREDIENT_UNIT = '@recipe/UpdateIngredientUnit',
  UPDATE_INGREDIENT_ID = '@recipe/UpdateIngredientId',
  DESELECT_INGREDIENT = '@recipe/DeselectIngredient',
}

export interface SetFoodForId {
  type: ActionType.SET_FOOD_FOR_ID,
  food: NormalizedFood,
  foodId: string,
}

export interface AddIngredient {
  type: ActionType.ADD_INGREDIENT,
  foodRef: FoodRef,
}

export interface UpdateIngredientAmount {
  type: ActionType.UPDATE_INGREDIENT_AMOUNT,
  index: number,
  amount: number,
}

export interface UpdateIngredientUnit {
  type: ActionType.UPDATE_INGREDIENT_UNIT,
  index: number,
  unit: string,
}

export interface UpdateIngredientId {
  type: ActionType.UPDATE_INGREDIENT_ID,
  index: number,
  foodId: string,
}

export interface DeselectIngredient {
  type: ActionType.DESELECT_INGREDIENT,
  index: number,
}

export type Action = SetFoodForId | AddIngredient | UpdateIngredientAmount | UpdateIngredientUnit | UpdateIngredientId | DeselectIngredient;