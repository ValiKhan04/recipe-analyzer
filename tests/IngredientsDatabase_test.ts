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

import { IngredientDatabase } from '../IngredientDatabase';
import { TEST_SR_LEGACY_FOOD, TEST_RECIPE_DETAILS } from './testData';

import { expect } from 'chai';
import 'mocha';
import { mock, instance, when, verify } from 'ts-mockito';
import { FirebaseAdaptor } from '../appsscript/FirebaseAdaptor';

describe('FoodDatabase', () => {
  let mockedUserCache: GoogleAppsScript.Cache.Cache = mock<GoogleAppsScript.Cache.Cache>();
  when(mockedUserCache.get('11111')).thenReturn(JSON.stringify(TEST_SR_LEGACY_FOOD));

  let mockedScriptProperties = mock<GoogleAppsScript.Properties.Properties>();
  when(mockedScriptProperties.getProperty('USDA_API_KEY')).thenReturn('abcde');
  when(mockedScriptProperties.getProperty('FIREBASE_PROJECT_NAME')).thenReturn('fghij');
  let scriptProperties = instance(mockedScriptProperties);

  let mockedPropertiesService = mock<GoogleAppsScript.Properties.PropertiesService>();
  when(mockedPropertiesService.getScriptProperties()).thenReturn(scriptProperties);
  let propertiesService = instance(mockedPropertiesService);

  let mockedScriptApp = mock<GoogleAppsScript.Script.ScriptApp>();
  let scriptApp = instance(mockedScriptApp);

  let mockedHTTPResponse = mock<GoogleAppsScript.URL_Fetch.HTTPResponse>();
  when(mockedHTTPResponse.getContentText()).thenReturn(JSON.stringify(TEST_SR_LEGACY_FOOD));

  let mockedUrlFetchApp = mock<GoogleAppsScript.URL_Fetch.UrlFetchApp>();
  when(mockedUrlFetchApp.fetch('https://api.nal.usda.gov/fdc/v1/12345?api_key=abcde')).thenReturn(
    instance(mockedHTTPResponse));
  let urlFetchApp = instance(mockedUrlFetchApp);

  let fdcClient = new IngredientDatabase(urlFetchApp, scriptApp, propertiesService);
  it('cached', () => {
    expect(fdcClient.getFoodDetails('https://fdc.nal.usda.gov/fdc-app.html#/food-details/11111/nutrients')).to.deep.equal(TEST_SR_LEGACY_FOOD);
    verify(mockedUserCache.put('11111', JSON.stringify(TEST_SR_LEGACY_FOOD), 21600)).once();
  });

  it('not cached', () => {
    expect(fdcClient.getFoodDetails('https://fdc.nal.usda.gov/fdc-app.html#/food-details/12345/nutrients')).to.deep.equal(TEST_SR_LEGACY_FOOD);
    verify(mockedUserCache.put('12345', JSON.stringify(TEST_SR_LEGACY_FOOD), 21600)).once();
  });

  it('local', () => {
    fdcClient.addCustomFood('id.abc123', TEST_RECIPE_DETAILS);
    expect(fdcClient.getFoodDetails('#bookmark=id.abc123')).to.deep.equal(TEST_RECIPE_DETAILS);
  });

  it('local not found', () => {
    expect(fdcClient.getFoodDetails('#bookmark=id.def456')).to.equal(null);
  });
});