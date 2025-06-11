import * as postImportsTypes from "./src/types";

declare module "post-imports" {
  export function processImports(config: postImportsTypes.Config): void;
  export interface PostImports {}
}

