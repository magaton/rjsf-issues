import { LocalStorageUtility } from "./local-storage-utility";

const configStateKey = "@AdminFunctionalities:configState"

class ConfigState {
  state: any | undefined;

  getState () {
    this.state = LocalStorageUtility.getValue(configStateKey);
    return this.state;
  }

  setState (state: any): void {
    this.state = state;
    LocalStorageUtility.setValue(configStateKey, state);
  }

  removeState (): void {
    this.state = undefined;
    LocalStorageUtility.removeValue(configStateKey);
  }
}

export const ConfigStateUtility = new ConfigState();