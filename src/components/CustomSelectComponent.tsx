import { WidgetProps } from "@rjsf/utils";
import { get, intersection, isArray, isEmpty, isNil, replace, set } from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FormsUtility } from "../utils/forms-utility";
import Grid from "@mui/material/Grid";

export const CustomSelect: FC<WidgetProps> = ({ options, formContext, registry, ...props }) => {
  const { SelectWidget } = registry.widgets;
  const [isEdited, setIsEdited] = useState<boolean>(false);

  let enumOptions = useMemo(() => {
    if (isArray(options.dependsOn) && !isEmpty(options.dependsOn)) {
      if (!isNil(options.pathToReplaceableValue) && !isEmpty(options.pathToReplaceableValue)) {
        const replaceableValue = get(formContext.formData, options.pathToReplaceableValue, "");
        const returnedFormData = options.dependsOn.map((path) => get(formContext.formData, replace(path as string, "{replaceableValue}", replaceableValue), []));
        return intersection(...returnedFormData);
      }
      const returnedFormData = options.dependsOn.map((path) => get(formContext.formData, path, []));
      return intersection(...returnedFormData);
    }

    if (!isNil(options.pathToReplaceableValue) && !isEmpty(options.pathToReplaceableValue)) {
      const replaceableValue = get(formContext.formData, options.pathToReplaceableValue, "");
      return get(formContext.formData, replace(options.dependsOn as string, "{replaceableValue}", replaceableValue), []);
    }
    return get(formContext.formData, options.dependsOn, []);
  }, [formContext.formData, options.dependsOn, options.pathToReplaceableValue]);

  useEffect(() => {
    if (!!options.setAllOptionsByDefault && !isEdited && !isEmpty(formContext.formData)) {
      const fieldData = get(formContext.formData, FormsUtility.transformIdToPath(props.id));
      let newFormData = formContext.formData;
      set(newFormData, FormsUtility.transformIdToPath(props.id), isNil(fieldData) || isEmpty(fieldData) ? enumOptions : fieldData);
      formContext.setFormData({ ...newFormData });

      if (!isEmpty(enumOptions)) {
        setIsEdited(true);
      }
    }
  }, [enumOptions, formContext, isEdited, options.setAllOptionsByDefault, props.id]);

  if (!enumOptions) {
    return null;
  }

  const customOptions = { ...options, enumOptions: FormsUtility.getFilterOptions(enumOptions) };

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
