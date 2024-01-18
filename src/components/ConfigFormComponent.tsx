import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { RJSFSchema, RegistryWidgetsType, deepEquals} from "@rjsf/utils";
import Form from '@rjsf/mui';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { CustomSelect } from "./CustomSelectComponent";
import { FormsUtility } from "../utils/forms-utility";
import { get, isEmpty, isNil, keys, merge } from "lodash";
import { IDependablePaths } from "../models/IDependablePaths";
import { HiddenDataUtility } from "../utils/hidden-data-utility";

const schema: RJSFSchema = require("../configSchema.json");
const initialFormData = require("../formData.json");
const uiSchema = require("../configUISchema.json"); // Import the UI schema from the file system

const dependablePaths: IDependablePaths = {
  "currency.list": [
    "currency.$isMulticurrencyRequired",
  ],
  "currency.exchangeRate.mode": [
    "currency.exchangeRate.$isExchangeRateAuto",
  ],
  "compensationPlan.type": [
    "client.$isCompensationPlanMLM",
    "client.$isCompensationPlanInfluencerMarketing"
  ]
}

const ConfigFormComponent: React.FC = () => {

    const [formData, setFormData] = useState(initialFormData); 
    const [isLoading, setIsloading] = useState<boolean>(true);

    const onSubmit = ({ formData }: IChangeEvent<any, any>) => {
      console.log('SUBMIT formData:', formData);
    };

    const widgets: RegistryWidgetsType = {
        CustomSelectComponent: CustomSelect
    };

    const onValueChange = useCallback((fData: any, id?: string) => {
      if (!deepEquals(formData, fData)) {
        setIsloading(true);
        if (isNil(id)) {
          const t = keys(dependablePaths).map((path) => {
            return HiddenDataUtility.handleHiddenData({ formData: fData, pathFromId: path, dependablePaths: get(dependablePaths, path) });
          })
          const editedData = merge({}, ...t);
          setFormData({ ...editedData });
        } 
        else {
          const pathFromId = FormsUtility.transformIdToPath(id);
          const currentDependablePaths = get(dependablePaths, pathFromId);
          if (!isNil(currentDependablePaths)) {
            const editedFormData = HiddenDataUtility.handleHiddenData({ formData: fData, pathFromId: FormsUtility.transformIdToPath(id), dependablePaths: currentDependablePaths });
            setFormData((state: any) => ({ ...state, ...editedFormData }));
          } else {
            setFormData((state: any) => ({ ...state, ...fData }));
          }
        }
        setIsloading(false);
      }
    }, [formData]);

    return (
      <div className="main">
        <Form 
            schema={schema} 
            validator={validator} 
            uiSchema={uiSchema} 
            widgets={widgets}
            formData={formData}
            onChange={(data, id) => { onValueChange(data.formData, id) }}
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

export default ConfigFormComponent;