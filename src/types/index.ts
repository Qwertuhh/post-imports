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
interface Config {
  root: string;
  files?: string[];
  changes: ChangeConfig[];
  ignore?: string[];
  file?: FileConfig[];
}

export { ImportInfo, FileConfig, ChangeConfig, Config };

