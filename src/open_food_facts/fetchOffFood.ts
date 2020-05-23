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

import { Food, StatusOr, StatusCode, status } from "../core";

interface OffFood {
  product: {
    serving_size: string;
    nutriments: {
      [index: string]: number;
    };
  };
}

function getOffFoodUrl(eanOrUpc: string): string {
  return "https://world.openfoodfacts.org/api/v0/product/" + eanOrUpc + ".json";
}

export async function fetchOffFood(
  eanOrUpc: string,
  config: {
    nutrients: {
      id: number;
      offName: string;
      offScale: number; // Divide OFF number by this to get FDC equiv.
      name: string;
    }[];
    massUnits: { [index: string]: number };
    volumeUnits: { [index: string]: number };
  }
): Promise<StatusOr<Food>> {
  const response = await fetch(getOffFoodUrl(eanOrUpc));
  const json = await response.json();
  return status(StatusCode.FOOD_NOT_FOUND, JSON.stringify(json));
}
