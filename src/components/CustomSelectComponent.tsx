import { WidgetProps} from "@rjsf/utils";
import { get, intersection, isArray, isEmpty, isNil, replace, set } from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FormsUtility } from "../utils/forms-utility";
import { log } from "console";

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
    props.onChange(formContext.formData);
    console.log("########## CustomSelect TRIGGER UPDATE !!!!!!!!!!!!")},[]
  );


  useEffect(() => {
    if (!!options.setAllOptionsByDefault && !isEdited && !isEmpty(formContext.formData)) {
      const fieldData = get(formContext.formData, FormsUtility.getPathFromId(props.id));

      //if (options.path === "downline.collapsingStrategy.clientTypes" || options.path === "downline.recruitmentPolicy.clientTypes") {
      console.log("@@@@@ useEffect1 CustomSelect path", options.path);
      console.log("@@@@@ useEffect1 CustomSelect fieldData", fieldData);
      //}
      let newFormData = formContext.formData;
      //if (options.path === "downline.collapsingStrategy.clientTypes" || options.path === "downline.recruitmentPolicy.clientTypes") {
      //console.log("@@@@@ useEffect1 CustomSelect path", options.path);
      //console.log("@@@@@ useEffect1 CustomSelect newFormData", newFormData);
      //}
      set(newFormData, FormsUtility.getPathFromId(props.id), isNil(fieldData) || isEmpty(fieldData) ? enumOptions : fieldData);
      formContext.setFormData({ ...newFormData });
      //if (options.path === "downline.collapsingStrategy.clientTypes" || options.path === "downline.recruitmentPolicy.clientTypes") {
      //console.log("@@@@@ useEffect1 CustomSelect path", options.path);
      //console.log("@@@@@ useEffect1 CustomSelect formContext.formData", formContext.formData);
      //}
      if (!isEmpty(enumOptions)) {
        setIsEdited(true);
      }
    }
  }, [enumOptions, formContext, isEdited, options.setAllOptionsByDefault, props.id]);

  const shouldHideWidget = useMemo(() => !!options.hideWidget, [options.hideWidget]);

  useEffect(() => {
    if (shouldHideWidget && !isNil(enumOptions) && !isEmpty(formContext.formData)) {
      let newFormData = formContext.formData;

      //if (options.path === "downline.collapsingStrategy.clientTypes" || options.path === "downline.recruitmentPolicy.clientTypes") {
      console.log("###### useEffect2 CustomSelect path", options.path);
      console.log("###### useEffect2 CustomSelect newFormData", newFormData);
      //}
      const path = FormsUtility.getPathFromId(props.id);
      set(newFormData, path, enumOptions);
      formContext.setFormData({ ...newFormData });

      //if (options.path === "downline.collapsingStrategy.clientTypes" || options.path === "downline.recruitmentPolicy.clientTypes") {
      //console.log("###### useEffect2 CustomSelect formContext.formData", formContext.formData);
      //}
    }
  }, [enumOptions, formContext, props.id, shouldHideWidget]);

  if (!enumOptions) {
    return null;
  }

  if (options.returnLengthOnly != null && options.returnLengthOnly === true) {
    enumOptions = [enumOptions.length];
  }

  const customOptions = { ...options, enumOptions: FormsUtility.getFilterOptions(enumOptions) };

  

  

  //console.log("@@@@@ CustomSelect path:", options.path);
  //if (options.path === "downline.collapsingStrategy.clientTypes" || options.path === "downline.recruitmentPolicy.clientTypes") {
  console.log("$$$$$$$$$$ CustomSelect Render customOptions", customOptions.enumOptions);
  //}
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