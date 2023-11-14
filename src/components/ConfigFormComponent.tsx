import React, { useState } from "react";
import { RJSFSchema, RegistryWidgetsType } from "@rjsf/utils";
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { CustomSelect } from "./CustomSelectComponent";
import { TypeLevelsCustomSelect } from "./TypeLevelsSelectComponent";
// change the schemas if you want to see appendix and internationalization screens
const schema: RJSFSchema = require("../configAppendixSchema.json");
const initialFormData = require("../formData.json");
const uiSchema = require("../configAppendixUISchema.json"); // Import the UI schema from the file system


const ConfigFormComponent: React.FC = () => {
   
    const [formData, setFormData] = useState(initialFormData); 
    
    const onSubmit = ({ formData }: any) => {
      console.log("SUBMIT formData", formData);
    };
    const widgets: RegistryWidgetsType = {
        CustomSelectComponent: CustomSelect,
        TypeLevelsCustomSelectComponent: TypeLevelsCustomSelect
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
            onChange={(data) => {setFormData({...formData, ...data.formData});}}
            onSubmit={onSubmit}
            liveValidate={false}
            liveOmit={false}
            omitExtraData={false}
            formContext={{formData, setFormData}} 
        />
      </div>
    );
  };

export default ConfigFormComponent;