import { useEffect, useState } from "react";
import { ConfigStateUtility } from "./config-state-utility";

export const useConfigStateBackup = () => {
  const [storedState, setStoredState] = useState<any>();

  useEffect(() => {
    const state = ConfigStateUtility.getState();
    setStoredState(state);
  }, [setStoredState]);

  return storedState;
};