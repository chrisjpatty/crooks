import { nanoid } from "nanoid/non-secure";
import useLocalStorage from "./useLocalStorage";

export type CrookFile = {
  id: string;
  created: number;
  modified: number;
  data: any;
};

const useFiler = (localStorageKey: string) => {
  const [files, setFiles] = useLocalStorage<Record<string, CrookFile>>(
    localStorageKey,
    {}
  );

  const add = (data: any, fileId?: string) => {
    const newKey = fileId || nanoid(8);
    const now = Date.now();
    setFiles((files) => ({
      ...files,
      [newKey]: {
        id: newKey,
        created: now,
        modified: now,
        data,
      },
    }));
    return newKey;
  };

  const remove = (fileId: string) => {
    setFiles(({ [fileId]: deleted, ...newFiles }) => newFiles);
  };

  const update = (fileId: string, data: any) => {
    setFiles((files) => ({
      ...files,
      [fileId]: {
        ...files[fileId],
        modified: Date.now(),
        data: typeof data === "function" ? data(files[fileId]) : data,
      },
    }));
  };

  const clear = () => {
    setFiles({});
  };

  return [files, { add, remove, update, clear }];
};

export default useFiler;
