import { CopyConfig } from "@/types";
import { join, resolve } from "path";
import copy from "copy";

/**
 * Copies all files from the "from" directory to the "to" directory, using the
 * "copy" module. If the "to" directory does not exist, it is created. If there
 * is an error during copy, it is re-thrown.
 *
 * @param root - The root directory to be joined with the "from" and "to" paths.
 * @param config - The CopyConfig object with the "from" and "to" paths.
 * @returns A list of files that were copied.
 */
function copyFiles(root: string, config: CopyConfig): string[] {
  const { from, to } = config;
  const fileFromPath = resolve(join(root, from));
  const fileToPath = resolve(join(root, to));

  let fileCopied: string[] = [];
  copy(fileFromPath, fileToPath, (error: any, files: any) => {
    if (error) throw error;
    fileCopied = files;
  });
  return fileCopied;
}

export default copyFiles;
