import { WidgetProps } from "@rjsf/utils";
import { get, set, unset} from "lodash";
import React, { FC, useEffect} from "react";
import { FormsUtility } from "../utils/forms-utility";

export const CustomHidden: FC<WidgetProps> = ({ options, registry, formContext, ...props }) => {
    const { HiddenWidget } = registry.widgets;
    
    // super ugly, refactor later
    useEffect(() => {
        let newFormData = formContext.formData;
        console.log("CustomHidden newFormData", newFormData)
        // get the source field name
        const fieldName= FormsUtility.getFieldNameFromPath(props.id, "_");
        const path = FormsUtility.transformIdToPath(props.id);
        const parentPath= FormsUtility.getParentPath(path);
        // set the lenth of the passed array 

        if (fieldName ===  "isCompensationPlanMLM") {
            const compensationPlan = get(formContext.formData, options.dependsOn);
            if(compensationPlan==="mlm"){
                set(newFormData, path, "true");
                const siblingPaths = FormsUtility.findSiblingsWithPrefix(path, "isCompensationPlan", newFormData);
           
                siblingPaths.forEach( (element) => {
                    unset(newFormData, element);
                });
                formContext.setFormData({ ...newFormData });
                console.log("CustomHidden isCompensationPlanMLM updated formData", formContext.formData);
            }
        }
        else if (fieldName ===  "isCompensationPlanInfluencerMarketing") {
            const compensationPlan = get(formContext.formData, options.dependsOn);
            if(compensationPlan==="influencerMarketing"){
                set(newFormData, path, "true");
                const siblingPaths = FormsUtility.findSiblingsWithPrefix(path, "isCompensationPlan", newFormData);
           
                siblingPaths.forEach( (element) => {
                    unset(newFormData, element);
                });
                formContext.setFormData({...newFormData});
                console.log("CustomHidden isCompensationPlanInfluencerMarketing updated formData", formContext.formData);
            }
        }
    }, [formContext, props.id, options.dependsOn]);

    return (
        <div style={{display: 'none' }}>
            <HiddenWidget
                {...props}
                options={options}
                registry={registry}
            />
        </div>
    )
}