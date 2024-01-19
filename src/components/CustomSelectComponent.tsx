import { WidgetProps } from "@rjsf/utils";
import { get, intersection, isArray, isEmpty, isNil, replace, set } from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FormsUtility } from "../utils/forms-utility";
import Grid from "@mui/material/Grid";

export const CustomSelect: FC<WidgetProps> = ({ options, formContext, registry, ...props }) => {
  const { SelectWidget } = registry.widgets;

  let enumOptions = [];
  if (isArray(options.dependsOn) && !isEmpty(options.dependsOn)) {
    const returnedFormData = options.dependsOn.map((path) => get(formContext.formData, path, []));
    enumOptions = intersection(...returnedFormData);
  }
  
  enumOptions = get(formContext.formData, options.dependsOn, []);

  const customOptions = { ...options, enumOptions: FormsUtility.getFilterOptions(enumOptions) };
  console.info("@@@@@ CustomSelect for field: %s, customOptions: %s", props.id, JSON.stringify(customOptions))
  return (
    <Grid item container sx={{ all: 'inherit' }}>
      <SelectWidget
        {...props}
        options={customOptions}
        registry={registry}
        multiple={!!options.multiSelect || props.multiple}
      />
    </Grid>
  )
}
