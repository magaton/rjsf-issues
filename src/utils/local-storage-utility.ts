import { isObject } from "lodash";

export class LocalStorageUtility {
  /**
   * Stores a value in local storage
   * @param key The key to store by
   * @param value The value to store
   */
  static setValue (key: string, value: any): void {
    window.localStorage.setItem(key, isObject(value) ? JSON.stringify(value) : value);
  }

  /**
   * Gets a value from local storage
   * @param key The key stored by
   * @returns The stored value
   */
  static getValue (key: string): any {
    try {
      const value = window.localStorage.getItem(key);
      if (value) {
        try {
          return JSON.parse(value);
        } catch (err) {
          return value;
        }
      }
      return value;
    } catch (err) {
      return null;
    }
  }

  /**
   * Removes a value in local storage
   * @param key The key to store by
   */
  static removeValue (key: string): void {
    window.localStorage.removeItem(key);
  }
}
