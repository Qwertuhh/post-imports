interface ImportInfo {
  import: string;
  importFrom: string;
  line: number;
}
interface FileConfig {
  path: string;
  toChange: string;
  toChangeFrom: string;
}

interface ChangeConfig {
  toChange: string;
  toChangeFrom: string;
}
interface CopyConfig {
  from: string;
  to: string;
}
interface Config {
  copy?: CopyConfig[];
  delete?: string[];
  root: string;
  type: "esm" | "cjs";
  files?: string[];
  changes: ChangeConfig[];
  ignore?: string[];
  file?: FileConfig[];
}

export { ImportInfo, FileConfig, ChangeConfig, Config, CopyConfig };
