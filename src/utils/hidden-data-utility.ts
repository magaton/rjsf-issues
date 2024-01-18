import { get, isNil, merge, set, unset } from "lodash";
import { FormsUtility } from "./forms-utility";

interface IHandleHiddenDataProps {
  formData: any;
  pathFromId: string;
  dependablePaths: string[];
}

export class HiddenDataUtility {
  static handleHiddenData({ formData, pathFromId, dependablePaths }: IHandleHiddenDataProps) {
    let previousFormData = formData;
    const editedFormData = dependablePaths.map((currentPath: string) => {
      const currentData = previousFormData;
      const fieldName = FormsUtility.getFieldNameFromPath(currentPath, ".");
      const path = FormsUtility.transformIdToPath(currentPath);

      // set the length of the passed array 
      if (fieldName === "$isEnabled") {
        let flag: boolean | null = get(currentData, pathFromId, false);
        if (isNil(flag) || flag === false) {
          unset(currentData, path);
        }
        else {
          set(currentData, path, "true");
        }
      }
      else if (fieldName === "$isMulticurrencyRequired") {
        const inputArray: string[] = get(currentData, pathFromId, []);
        if (inputArray.length >= 2) {
          set(currentData, path, "true");
        } else {
          unset(currentData, path);
          unset(currentData, 'currency.exchangeRate');
        }
      }
      else if (fieldName === "$isCompensationPlanMLM") {
        const compensationPlan = get(currentData, pathFromId);
        if (compensationPlan === "mlm" || isNil(compensationPlan)) {
          set(currentData, currentPath, "mlm");
          set(currentData, path, "true");
          const siblingPaths = FormsUtility.findSiblingsWithPrefix(path, "$isCompensationPlan", currentData);

          siblingPaths.forEach((element) => {
            unset(currentData, element);
          });
        }
      }
      else if (fieldName === "$isCompensationPlanInfluencerMarketing") {
        const compensationPlan = get(currentData, pathFromId);
        if (compensationPlan === "influencerMarketing" || isNil(compensationPlan)) {
          set(currentData, currentPath, "influencerMarketing");
          set(currentData, path, "true");
          const siblingPaths = FormsUtility.findSiblingsWithPrefix(path, "$isCompensationPlan", currentData);

          siblingPaths.forEach((element) => {
            unset(currentData, element);
          });
        }
      }
      else if (fieldName === "$isExchangeRateAuto") {
        const exchangeRateMode = get(currentData, pathFromId);
        if (exchangeRateMode === "auto") {
          set(currentData, path, "true");
        }
        else {
          unset(currentData, path);
          unset(currentData, 'currency.exchangeRate.exchangeRateRefreshFrequency');
        }
      }
      else if (fieldName === "$isEnrollmentTypeSubscription") {
        const enrollmentType = get(currentData, pathFromId);
        if (enrollmentType === "Subscription") {
          set(currentData, path, "true");
          const siblingPaths = FormsUtility.findSiblingsWithPrefix(path, "$isEnrollmentType", currentData);
          // console.log("enrollmentType: %s, isEnrollmentTypeSubscription siblings: %s", enrollmentType, siblingPaths);
          siblingPaths.forEach((element) => {
            unset(currentData, element);
          });
        }
      }
      else if (fieldName === "$isEnrollmentTypeStarterKits") {
        const enrollmentType = get(currentData, pathFromId);
        if (enrollmentType === "StarterKits") {
          set(currentData, path, "true");
          const siblingPaths = FormsUtility.findSiblingsWithPrefix(path, "$isEnrollmentType", currentData);
          // console.log("enrollmentType: %s, isEnrollmentTypeStarterKits siblings: %s", enrollmentType, siblingPaths);
          siblingPaths.forEach((element) => {
            unset(currentData, element);
          });
        }
      }
      else if (fieldName === "$isEnrollmentTypeApprenticeModel") {
        const enrollmentType = get(currentData, pathFromId);
        if (enrollmentType === "ApprenticeModel") {
          set(currentData, path, "true");
          const siblingPaths = FormsUtility.findSiblingsWithPrefix(path, "$isEnrollmentType", currentData);
          // console.log("enrollmentType: %s, isEnrollmentTypeApprenticeModel siblings: %s", enrollmentType, siblingPaths);
          siblingPaths.forEach((element) => {
            unset(currentData, element);
          });
        }
      }
      else if (fieldName === "$isEnrollmentTypeByInvite") {
        const enrollmentType = get(currentData, pathFromId);
        if (enrollmentType === "ByInvite") {
          set(currentData, path, "true");
          const siblingPaths = FormsUtility.findSiblingsWithPrefix(path, "$isEnrollmentType", currentData);
          // console.log("enrollmentType: %s, isEnrollmentTypeByInvite siblings: %s", enrollmentType, siblingPaths);
          siblingPaths.forEach((element) => {
            unset(currentData, element);
          });
        }
      }
      else if (fieldName.startsWith("periodType")) {
        const valueToBeCopied = get(formData, pathFromId);
        if (!isNil(valueToBeCopied)) {
          set(currentData, path, valueToBeCopied);
        } else {
          unset(currentData, path);
        }
      }

      previousFormData = currentData;
      return { ...previousFormData };
    })

    return merge({}, ...editedFormData);
  }
}