import React, {useEffect, useState } from "react";
import { RJSFSchema, RegistryWidgetsType } from "@rjsf/utils";
import staticvalidator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';
import { IChangeEvent } from '@rjsf/core';
import { CustomSelect } from "./CustomSelectComponent";
import { CustomHidden } from "./CustomHiddenComponent";
import { evaluateValidator } from '../utils/evaluateValidator';
import { createPrecompiledValidator, ValidatorFunctions } from '@rjsf/validator-ajv8';
import { compileSchemaValidatorsCode } from '@rjsf/validator-ajv8/lib/compileSchemaValidators';


// change the schemas if you want to see appendix and internationalization screens
const schema: RJSFSchema = require("../configSchema.json");
const initialFormData = require("../formData.json");
const uiSchema = require("../configUISchema.json")

const code = compileSchemaValidatorsCode(schema, {});


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