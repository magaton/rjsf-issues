import { WidgetProps } from "@rjsf/utils";
import { get, isEmpty, isNil, set } from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FormsUtility } from "../utils/forms-utility";

export const TypeLevelsCustomSelect: FC<WidgetProps> = ({ options, registry, formContext, ...props }) => {

  const { SelectWidget } = registry.widgets;
  const { pathToMinLevel, pathToMaxLevel, pathToClientTypes, pathToSponsorClientTypes } = options;
  const [endOfRange, setEndOfRange] = useState<number | undefined>(undefined);
  const [shouldHideWidget, setShouldHideWidget] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [previousMinLevel, setPreviousMinLevel] = useState<number | undefined>(undefined);
  const [previousMaxLevel, setPreviousMaxLevel] = useState<number | undefined>(undefined);

  const enumOptions = useMemo(() => {
    if (!isNil(pathToMinLevel) && !isNil(pathToMaxLevel) && !isNil(pathToClientTypes) && !isNil(pathToSponsorClientTypes)) {
      const minLevel = get(formContext.formData, pathToMinLevel as string);
      const maxLevel = get(formContext.formData, pathToMaxLevel as string);
      setEndOfRange(maxLevel);
      const clientTypes = get(formContext.formData, pathToClientTypes as string, "");
      const sponsorClientTypes = get(formContext.formData, pathToSponsorClientTypes as string, "");
      const result = FormsUtility.getTypeLevelEnumOptions(clientTypes, sponsorClientTypes, minLevel as number, maxLevel as number);
      console.log("########## TypeLevelsCustomSelect useMemo enumOptions", result);
      return result;
    }
    return [];
  }, [formContext.formData, pathToClientTypes, pathToMaxLevel, pathToMinLevel, pathToSponsorClientTypes]);


  useEffect(() => {
    if (!!options.setAllOptionsByDefault && !isEdited && !isEmpty(formContext.formData)) {
      const fieldData = get(formContext.formData, FormsUtility.getPathFromId(props.id));
      let newFormData = formContext.formData;
      set(newFormData, FormsUtility.getPathFromId(props.id), isNil(fieldData) || isEmpty(fieldData) ? enumOptions : fieldData);
      formContext.setFormData({ ...newFormData });
      //console.log("@@@@@ TypeLevelsCustomSelect formContext", formContext.formData)
      if (!isEmpty(enumOptions)) {
        setIsEdited(true);
      }
    }
  }, [enumOptions, formContext, isEdited, options.setAllOptionsByDefault, props.id]);

  useEffect(() => {
    if (isNil(endOfRange) || endOfRange > 5) {
      props.schema.title = " ";
      setShouldHideWidget(true);
    } else {
      props.schema.title = "Type Levels"
      setShouldHideWidget(false);
    }
  }, [endOfRange, props.schema]);

  useEffect(() => {
    const minLevel = get(formContext.formData, pathToMinLevel as string);
    const maxLevel = get(formContext.formData, pathToMaxLevel as string);
    const fieldData = get(formContext.formData, FormsUtility.getPathFromId(props.id));
    let newFormData = formContext.formData;

    if ((minLevel !== previousMinLevel || maxLevel !== previousMaxLevel) && isEdited) {
      set(newFormData, FormsUtility.getPathFromId(props.id), enumOptions);
    } else {
      set(newFormData, FormsUtility.getPathFromId(props.id), fieldData);
    }
    formContext.setFormData({ ...newFormData });
    setPreviousMinLevel(minLevel);
    setPreviousMaxLevel(maxLevel);

  }, [enumOptions, formContext, isEdited, pathToMaxLevel, pathToMinLevel, previousMaxLevel, previousMinLevel, props.id]);

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
      />
    </div>
  )
}