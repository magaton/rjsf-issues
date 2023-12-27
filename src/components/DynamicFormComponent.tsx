import React, {useEffect, useState } from "react";
import { RJSFSchema, RegistryWidgetsType } from "@rjsf/utils";
import staticvalidator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';
import { IChangeEvent } from '@rjsf/core';
import { CustomSelect } from "./CustomSelectComponent";
import { CustomHidden } from "./CustomHiddenComponent";
import { FormsUtility } from "../utils/forms-utility";
import Ajv from 'ajv';
import { createPrecompiledValidator, ValidatorFunctions } from '@rjsf/validator-ajv8';

import ajvRuntimeEqual from 'ajv/dist/runtime/equal';
import {
  parseJson as ajvRuntimeparseJson,
  parseJsonNumber as ajvRuntimeparseJsonNumber,
  parseJsonString as ajvRuntimeparseJsonString,
} from 'ajv/dist/runtime/parseJson';
import ajvRuntimeQuote from 'ajv/dist/runtime/quote';
// import ajvRuntimeRe2 from 'ajv/dist/runtime/re2';
import ajvRuntimeTimestamp from 'ajv/dist/runtime/timestamp';
import ajvRuntimeUcs2length from 'ajv/dist/runtime/ucs2length';
import ajvRuntimeUri from 'ajv/dist/runtime/uri';
import * as ajvFormats from 'ajv-formats/dist/formats';


const { compileSchemaValidators } = require('@rjsf/validator-ajv8');

// change the schemas if you want to see appendix and internationalization screens
const schema: RJSFSchema = require("../configSchema.json");
const initialFormData = require("../formData.json");
const uiSchema = require("../configUISchema.json")

const code = compileSchemaValidators(schema);

const validatorsBundleReplacements: Record<string, [string, unknown]> = {
  // '<code to be replaced>': ['<variable name to use as replacement>', <runtime dependency>],
  'require("ajv/dist/runtime/equal").default': ['ajvRuntimeEqual', ajvRuntimeEqual],
  'require("ajv/dist/runtime/parseJson").parseJson': ['ajvRuntimeparseJson', ajvRuntimeparseJson],
  'require("ajv/dist/runtime/parseJson").parseJsonNumber': ['ajvRuntimeparseJsonNumber', ajvRuntimeparseJsonNumber],
  'require("ajv/dist/runtime/parseJson").parseJsonString': ['ajvRuntimeparseJsonString', ajvRuntimeparseJsonString],
  'require("ajv/dist/runtime/quote").default': ['ajvRuntimeQuote', ajvRuntimeQuote],
  // re2 by default is not in dependencies for ajv and so is likely not normally used
  // 'require("ajv/dist/runtime/re2").default': ['ajvRuntimeRe2', ajvRuntimeRe2],
  'require("ajv/dist/runtime/timestamp").default': ['ajvRuntimeTimestamp', ajvRuntimeTimestamp],
  'require("ajv/dist/runtime/ucs2length").default': ['ajvRuntimeUcs2length', ajvRuntimeUcs2length],
  'require("ajv/dist/runtime/uri").default': ['ajvRuntimeUri', ajvRuntimeUri],
  // formats
  'require("ajv-formats/dist/formats")': ['ajvFormats', ajvFormats],
};

const regexp = new RegExp(
  Object.keys(validatorsBundleReplacements)
    .map((key) => key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|'),
  'g'
);

function wrapAjvBundle(code: string) {
  return `function(${Object.values(validatorsBundleReplacements)
    .map(([name]) => name)
    .join(', ')}){\nvar exports = {};\n${code.replace(
    regexp,
    (req) => validatorsBundleReplacements[req][0]
  )};\nreturn exports;\n}`;
}

const windowValidatorOnLoad = '__rjsf_validatorOnLoad';
const schemas = new Map<
  string,
  { promise: Promise<ValidatorFunctions>; resolve: (result: ValidatorFunctions) => void }
>();
if (typeof window !== 'undefined') {
  // @ts-ignore
  window[windowValidatorOnLoad] = (loadedId: string, fn: (...args: unknown[]) => ValidatorFunctions) => {
    const validator = fn(...Object.values(validatorsBundleReplacements).map(([, dep]) => dep));
    let validatorLoader = schemas.get(loadedId);
    if (validatorLoader) {
      validatorLoader.resolve(validator);
    } else {
      throw new Error(`Unknown validator loaded id="${loadedId}"`);
    }
  };
}

/**
 * Evaluate precompiled validator in browser using script tag
 * @param id Identifier to avoid evaluating the same code multiple times
 * @param code Code generated server side using `compileSchemaValidatorsCode`
 * @param nonce nonce attribute to be added to script tag (https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce#using_nonce_to_allowlist_a_script_element)
 */
export function evaluateValidator(id: string, code: string, nonce: string): Promise<ValidatorFunctions> {
  let maybeValidator = schemas.get(id);
  if (maybeValidator) return maybeValidator.promise;
  let resolveValidator: (result: ValidatorFunctions) => void;
  const validatorPromise = new Promise<ValidatorFunctions>((resolve) => {
    resolveValidator = resolve;
  });
  schemas.set(id, {
    promise: validatorPromise,
    resolve: resolveValidator!,
  });

  const scriptElement = document.createElement('script');

  scriptElement.setAttribute('nonce', nonce);
  scriptElement.text = `window["${windowValidatorOnLoad}"]("${id}", ${wrapAjvBundle(code)})`;

  document.body.appendChild(scriptElement);
  return validatorPromise;
}



const DynamicFormComponent: React.FC = () => {

  const [formData, setFormData] = useState(initialFormData); 

  let [precompiledValidator, setPrecompiledValidator] = useState<ValidatorFunctions>();

useEffect(() => {
  evaluateValidator(
    "config", // some schema id to avoid evaluating it multiple times
    code, // result of compileSchemaValidatorsCode returned from the server
    "" // nonce script tag attribute to allow this ib content security policy for the page
  ).then(setPrecompiledValidator);
}, ["config"]);

if (!precompiledValidator) {
  // render loading screen
  console.log("LOADING SCREEN")
}

const validator = precompiledValidator!==undefined ? createPrecompiledValidator(precompiledValidator, schema) : staticvalidator;


  const onSubmit = ({ formData }: IChangeEvent<any, any>) => {
    console.log('SUBMIT formData:', formData);
  };

  const widgets: RegistryWidgetsType = {
      CustomSelectComponent: CustomSelect,
      CustomHiddenComponent: CustomHidden
  };
  console.log("ConfigFormComponent formData", formData);
  return (
    <div className="main">
      <Form 
          schema={schema} 
          validator={validator} 
          uiSchema={uiSchema} 
          widgets={widgets}
          formData={formData}
          onChange={(data) => {setFormData({...formData, ...data.formData})}}
          onSubmit={onSubmit}
          liveValidate={false}
          liveOmit={false}
          omitExtraData={true}
          formContext={{formData, setFormData}} 
          experimental_defaultFormStateBehavior={{
            allOf: 'populateDefaults',
          }}
      />
    </div>
  );
};

export default DynamicFormComponent;