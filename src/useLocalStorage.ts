import React from "react";
import * as ls from "local-storage";

const getCache = <T extends any>(key: string, initial: T): T => {
  const cached = ls.get<T>(key);
  if (cached === null && initial !== null) {
    ls.set<T>(key, initial);
  }
  return cached !== null ? cached : initial;
};

type StateUpdater = (currentState: any) => any;

const isFunction = (val: unknown): val is Function => typeof val === "function";

const useLocalStorage = <T extends any>(
  key: string,
  initial: T
): [T, (state: T | ((currentState: T) => T)) => void] => {
  const [nativeState, setNativeState] = React.useState<T>(
    getCache<T>(key, initial)
  );

  const setState = (state: T | ((currentState: T) => T)): void => {
    if (isFunction(state)) {
      setNativeState((prev) => {
        const newState = state(prev);
        ls.set(key, newState);
        return newState;
      });
    } else {
      ls.set(key, state);
      setNativeState(state);
    }
  };

  return [nativeState, setState];
};

export default useLocalStorage;
