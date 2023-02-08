import { useState, Dispatch, SetStateAction } from 'react';

import {
  useInitialState,
  useStorageListener,
  useStorageWriter,
  StorageObj,
} from './common';

function useStorageState<S>(
  storage: StorageObj,
  key: string,
  defaultState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, Error | undefined];

function useStorageState<S>(
  storage: StorageObj,
  key: string
): [S | null, Dispatch<SetStateAction<S | null>>, Error | undefined];

function useStorageState<S>(
  storage: StorageObj,
  key: string,
  defaultState: S | (() => S) | null = null,
  serializeToJSON = false
) {
  const dS = serializeToJSON ? JSON.stringify(defaultState) : defaultState;

  const [state, setState] = useState(useInitialState(storage, key, dS));

  useStorageListener(storage, key, dS, setState);
  const writeError = useStorageWriter(storage, key, state);

  const setSerializedState = serializeToJSON
    ? (s: any) => setState(s ? JSON.stringify(s) : null)
    : setState;

  const serializedState = serializeToJSON
    ? state
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        JSON.parse(state)
      : null
    : state;

  return [serializedState, setSerializedState, writeError];
}

export default useStorageState;
