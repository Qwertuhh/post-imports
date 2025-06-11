import { globSync } from "glob";
import { join, resolve } from "path";
import { Config } from "@/types/index.js";

/**
 * Given a Config object, returns an array of all file paths that are matched
 * by the "files" option, but not by the "ignore" option.
 *
 * @param config - The configuration object to use for resolving file paths.
 * @returns An array of file paths that match the given configuration.
 */

function getAllPaths(config: Config): string[] {
  const { root, files, ignore } = config;
  let allFiles: string[] = [];

  if (!files || files.length === 0) {
    console.warn(
      "No files specified in the configuration. Returning an empty array."
    );
    return allFiles;
  }
  //? Patterns of files
  let patterns = files.map((file) => resolve(join(root, file)));
  const allSelectedFiles = globSync(patterns, {
    windowsPathsNoEscape: true,
    nodir: true,
  });

  if (!ignore || ignore.length === 0) {
    console.warn(
      "No ignore patterns specified in the configuration. Returning all files."
    );
    return allSelectedFiles;
  }
  patterns = ignore.map((file) => resolve(join(root, file)));
  const allignoredFiles = globSync(patterns, {
    windowsPathsNoEscape: true,
    nodir: true,
  });

  allFiles = allSelectedFiles.filter((file) => !allignoredFiles.includes(file));
  return allFiles;
}

export default getAllPaths;
