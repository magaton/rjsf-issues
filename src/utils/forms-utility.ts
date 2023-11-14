import { difference, flatMap, flatMapDeep, intersection, isEmpty, isNil, isPlainObject, join, map, pick, range, slice, values } from "lodash";

export class FormsUtility {
  private static getKeys (obj: any, parentKey?: string): string[] {
    return flatMapDeep(obj, (value, key) => {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      const keys = [currentKey];

      if (isPlainObject(value)) {
        return keys.concat(this.getKeys(value, currentKey));
      }

      return keys;
    });
  }

  static getConfigAppendixFormData (configFormData: any, appendixFormData: any) {
    const keysOfConfigFormData = FormsUtility.getKeys(configFormData);
    const keysOfConfigAppendixFormData = FormsUtility.getKeys(appendixFormData);
    const keysToBeKept = difference(keysOfConfigAppendixFormData, keysOfConfigFormData);
    return pick(appendixFormData, keysToBeKept);
  }

  static getFilterOptions (enumOptions: any[]) {
    return map(values(enumOptions), (value) => ({ label: value, value }))
  }

  static getTypeLevelEnumOptions(clientTypes: string[], sponsorClientTypes: string[], minLevel: number, maxLevel: number) {
    const levelRelatedConditions = isNil(minLevel) || isNil(maxLevel) || minLevel < 0 || maxLevel < 0;
    const typesRelatedConditions = isEmpty(clientTypes) || isEmpty(sponsorClientTypes);
    if (levelRelatedConditions || typesRelatedConditions) {
      return [];
    }

    const intersectedTypes = intersection(sponsorClientTypes, clientTypes);

    let options: string[] = [];

    if (minLevel === 0) {
      if (maxLevel <= 5) {
        options.push(...flatMap(range(minLevel, 1), (num) => intersectedTypes.map((type) => `${num}${type}`)));
        options.push(...flatMap(range(1, maxLevel + 1), (num) => clientTypes.map((type) => `${num}${type}`)));
      }
    } else {
      if (maxLevel <= 5) {
        options.push(...flatMap(range(minLevel, maxLevel + 1), (num) => clientTypes.map((type) => `${num}${type}`)));
      }
    }
    return options;
  }

  static generateArrayWithNumbersBetweenMinAndMax(min: number, max: number): number[] {
    const result: number[] = [];
    for (let i = min; i <= max; i++) {
        result.push(i);
    }

    return result;
  }    

  static getPathFromId (id: string): string  {
    const parts = id.split('_');
    if (parts.length < 2) {
      return id;
    }
    const transformedString = join(slice(parts, 1), '.');
    return transformedString;
  }
}