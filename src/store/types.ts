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
import { ThunkAction, ThunkDispatch as ReduxThunkDispatch } from "redux-thunk";
import { Document } from "../document/Document";
import { Status, Recipe, FDCFood, NormalizedFood } from "../core";

export interface LoadingState {
  type: "Loading";
}

export interface ErrorState {
  type: "Error";
  message: string;
}

export interface ActiveState {
  type: "Active";
  document: Document;
  selectedRecipeIndex: number;
  selectedIngredientIndex: number;
  fdcFoodsById: { [index: number]: NormalizedFood };
}

export type RootState = LoadingState | ErrorState | ActiveState;

export const initialState: RootState = {
  type: "Loading",
};

export enum ActionType {
  INITIALIZE = "@Initialize",
  SET_ERROR = "@SetError",
  SELECT_RECIPE = "@SelectRecipe",
  SELECT_INGREDIENT = "@SelectIngredient",
}

export interface Initialize {
  type: ActionType.INITIALIZE;
  document: Document;
  fdcFoodsById: { [index: number]: NormalizedFood };
}

export interface SetError {
  type: ActionType.SET_ERROR;
  message: string;
}

export interface SelectRecipe {
  type: ActionType.SELECT_RECIPE;
  index: number;
}

export interface SelectIngredient {
  type: ActionType.SELECT_INGREDIENT;
  index: number;
}

export type RootAction =
  | Initialize
  | SetError
  | SelectRecipe
  | SelectIngredient;

export type ThunkResult<R> = ThunkAction<R, RootState, undefined, RootAction>;
export type ThunkDispatch = ReduxThunkDispatch<
  RootState,
  undefined,
  RootAction
>;
