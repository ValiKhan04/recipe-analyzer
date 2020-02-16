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

/**
 * Functions that can be called from the HTML UI (client).
 * 
 * These functions provide access to the Google Doc and also Firebase and 
 * Web functions that are accesssed via the Apps Script server code.
 * 
 * For convenience we expose these as promises.
 */

import { IngredientIdentifier, FoodRef } from "../core/FoodRef";
import { Food } from "../core/Food";
import { NormalizedFood } from "../core/NormalizedFood";
const google = (<any>window)['google'];

function wrapAsPromise<T, U>(funcName: string): (args: T) => Promise<U> {
  return (args: T) => new Promise<U>((resolve, reject) => {
    google.script.run
    .withSuccessHandler(resolve)
    .withFailureHandler(reject)
    [funcName]
    .apply(null, args);
  });
}

export const getSearchResults = wrapAsPromise<[string], FoodRef[]>('getSearchResultsImpl');
export const showCustomIngredientSidebar = wrapAsPromise<[string], void>('showCustomIngredientSidebarImpl');
export const getFoodDetails = wrapAsPromise<[IngredientIdentifier], Food | null>('getFoodDetailsImpl');
export const patchFood = wrapAsPromise<[IngredientIdentifier, Food], void>('patchFoodImpl');
export const getNormalizedFoodDetails = wrapAsPromise<[IngredientIdentifier], NormalizedFood | null>('getNormalizedFoodDetailsImpl');
export const moveCursorToBookmark = wrapAsPromise<[string], void>('moveCursorToBookmarkImpl');
export const addIngredient = wrapAsPromise<[IngredientIdentifier, number, string, string], void>('addIngredientImpl');
export const getNutrientNames = wrapAsPromise<[], {id: number, name: string}[]>('getNutrientNamesImpl');