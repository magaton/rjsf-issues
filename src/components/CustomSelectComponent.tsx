import { WidgetProps} from "@rjsf/utils";
import { get, intersection, isArray, isEmpty, isNil, replace, set } from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FormsUtility } from "../utils/forms-utility";

export const CustomSelect: FC<WidgetProps> = ({ options, formContext, registry, ...props }) => {
  //console.log("######## CustomSelect STARTED path", options.path)
  //console.log("######## CustomSelect formContext", formContext.formData)
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
      const result = intersection(...returnedFormData)
      //console.log("---------- CustomSelect useMemo result: '%s, path: %s", result, options.path)
      return result;
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
      let newFormData = {...formContext.formData};
      set(newFormData, FormsUtility.transformIdToPath(props.id), isNil(fieldData) || isEmpty(fieldData) ? enumOptions : fieldData);
      formContext.setFormData({ ...newFormData });
      if (!isEmpty(enumOptions)) {
        setIsEdited(true);
      }
    }
  }, [enumOptions, formContext, isEdited, options.setAllOptionsByDefault, props.id]);

  const shouldHideWidget = useMemo(() => !!options.hideWidget, [options.hideWidget]);

  useEffect(() => {
    if (shouldHideWidget && !isNil(enumOptions) && !isEmpty(formContext.formData)) {
      let newFormData = {...formContext.formData};
      const path = FormsUtility.transformIdToPath(props.id);
      set(newFormData, path, enumOptions);
      formContext.setFormData({ ...newFormData });
    }
  }, [enumOptions, formContext, props.id, shouldHideWidget]);

  if (!enumOptions) {
    return null;
  }

  const customOptions = { ...options, enumOptions: FormsUtility.getFilterOptions(enumOptions) };


  return (
    <div style={{ all: 'inherit', display: shouldHideWidget ? 'none' : 'inherit' }}>
      <SelectWidget
        {...props}
        options={customOptions}
        registry={registry}
        multiple={!!options.multiSelect || props.multiple}
      />
    </div>
  )
}