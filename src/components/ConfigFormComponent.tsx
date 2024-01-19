import React, { useCallback, useState } from "react";
import { RJSFSchema, RegistryWidgetsType, deepEquals} from "@rjsf/utils";
import Form from '@rjsf/mui';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { CustomSelect } from "./CustomSelectComponent";
import { FormsUtility } from "../utils/forms-utility";
import { get, isNil, keys, merge } from "lodash";
import { Page } from "./common/Page";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
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

    const onSubmit = ({ formData }: IChangeEvent<any, any>) => {
      console.log('SUBMIT formData:', formData);
    };

    const widgets: RegistryWidgetsType = {
        CustomSelectComponent: CustomSelect
    };

    const onValueChange = useCallback((fData: any, id?: string) => {
      if (!deepEquals(formData, fData)) {
        if (isNil(id)) {
          const t = keys(dependablePaths).map((path) => {
            const editedFormData=HiddenDataUtility.handleHiddenData({ formData: fData, pathFromId: path, dependablePaths: get(dependablePaths, path) });
            console.log("#### Set initial data for dependable paths onValueChange: ", JSON.stringify(editedFormData));
            return editedFormData
          })
          const editedData = merge({}, ...t);
          console.log("#### Set initial data onValueChange: ", JSON.stringify(editedData));
          setFormData({ ...editedData });
        } 
        else {
          const pathFromId = FormsUtility.transformIdToPath(id);
          const currentDependablePaths = get(dependablePaths, pathFromId);
          if (!isNil(currentDependablePaths)) {
            const editedFormData = HiddenDataUtility.handleHiddenData({ formData: fData, pathFromId: FormsUtility.transformIdToPath(id), dependablePaths: currentDependablePaths });
            setFormData((state: any) => ({ ...state, ...editedFormData }));
            console.log("#### Calculate changed data onValueChange: ", JSON.stringify(editedFormData));
          } else {
            console.log("#### Set form data onValueChange: ", JSON.stringify(fData));
            setFormData((state: any) => ({ ...state, ...fData }));
          }
          
        }
      }
    }, [formData]);

    return (
      <Page sx={{ px: 1 }}>
        {
          <Grid item container direction="column" justifyContent="center">
            <Grid item container direction="column" py={2} px={1}>
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
              >
                <Grid item container justifyContent="center" mt={2}>
                  <Button variant="contained" type="submit" sx={{ ml: 2 }}>Submit</Button>
                </Grid>
              </Form>
            </Grid>
          </Grid>
        }
      </Page>
    );
  };

export default ConfigFormComponent;