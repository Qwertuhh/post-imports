import changeImportsOnce from "@/utils/changeImportsOnce";
import collectFilePaths from "@/utils/getAllPaths";
import getPostImportsConfig from "@/utils/getPostImportsConfig";
import { existsSync } from "fs";
import { join, resolve as resolvePath } from "path";
import { Config } from "@/types";
import copyFiles from "@/utils/copyFiles";
import deleteFiles from "./utils/deleteFiles";

/**
 * Copies files as specified in the configuration. If the configuration includes a
 * list of files to copy, each file is copied from the source to the destination
 * directories defined in the configuration. Logs the copying process to the console.
 *
 * @param config - The configuration object containing copy instructions.
 * @returns A promise that resolves to `true` if files were copied, or `false` if no
 * files were specified for copying.
 */

const copyFilesFunction = (config: Config) =>
  new Promise((resolve, reject) => {
    if (config.copy) {
      for (const copyConfig of config.copy) {
        console.log("Coping files ...");
        copyFiles(config.root, copyConfig);
      }
      console.log("Coping files completed");
      resolve(true);
    } else {
      resolve(false);
    }
  });

/**
 * Deletes files as specified in the configuration. If the configuration includes a
 * list of files to delete, each file is deleted from the specified path. Logs the
 * deletion process to the console.
 *
 * @param config - The configuration object containing delete instructions.
 * @returns A promise that resolves to `true` if files were deleted, or `false` if no
 * files were specified for deletion.
 */
const deleteFilesFunction = (config: Config) =>
  new Promise((resolve, reject) => {
    if (config.delete) {
      for (const filePath of config.delete) {
        console.log("Deleting files ...");
        deleteFiles(resolvePath(join(config.root, filePath)));
        console.log("Deleting files completed");
      }
      resolve(true);
    } else {
      resolve(false);
    }
  });

/**
 * Updates import statements in specific files as specified in the configuration.
 * If the configuration includes a list of files, each file's import statements
 * are updated from the old import path to the new import path. If a file does not
 * exist, it logs an error and continues to the next file. Logs the result of the
 * import updates to the console.
 *
 * @param config - The configuration object containing file-specific import change instructions.
 * @returns A promise that resolves to `true` when all specified files have been processed, or rejects with an error if an exception occurs.
 */
const priorityFileChanges = (config: Config) =>
  new Promise((resolve, reject) => {
    try {
      if (config.file) {
        for (const fileConfig of config.file) {
          let { path: filePath, toChange, toChangeFrom } = fileConfig;
          filePath = resolvePath(join(config.root, filePath));
          if (!existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            continue;
          }

          console.log(
            changeImportsOnce(filePath, toChange, toChangeFrom)
              ? `Changed imports in ${filePath} from ${toChangeFrom} to ${toChange}`
              : `No imports found that need updating in ${filePath}`
          );
        }
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Changes import statements in all the files specified in the `filePaths` array as
 * specified in the configuration. For each file, all import statements are updated
 * from the old import path to the new import path as specified in the `changes`
 * array in the configuration. If a file does not exist, it logs an error and
 * continues to the next file. Logs the result of the import updates to the console.
 *
 * @param filePaths - An array of file paths to be processed.
 * @param config - The configuration object containing the import change instructions.
 * @returns A promise that resolves to `undefined` when all specified files have been
 * processed, or rejects with an error if an exception occurs.
 */
const importsChanges = (filePaths: string[], config: Config) =>
  new Promise<void>((resolve, reject) => {
    console.log("Changing imports in files...");
    try {
      for (const filePath of filePaths) {
        if (!existsSync(filePath)) {
          console.error(`File not found: ${filePath}`);
          continue;
        }

        // Change imports in each file based on the changes specified in the config
        for (const change of config.changes) {
          const { toChange, toChangeFrom } = change;
          console.log(
            changeImportsOnce(filePath, toChange, toChangeFrom)
              ? `Changed imports in ${filePath} from ${toChangeFrom} to ${toChange}`
              : `No imports found that need updating in ${filePath}`
          );
        }
      }
      console.log("Changing imports in files completed.");
      resolve();
    } catch (error) {
      reject(error);
    }
  });

function postImports(filePath: string = "./package.json"): boolean {
  let result = false;
  const config: Config = getPostImportsConfig(filePath);
  //? To get all files for changing imports in the files specified in the config
  const filePaths = collectFilePaths(config);

  const promises = [
    //* To copy files
    copyFilesFunction(config),
    //* To delete files
    deleteFilesFunction(config),
    //* First change the file imports as specified in the config. to maintain the priority
    priorityFileChanges(config),
    //* Change imports in each file
    importsChanges(filePaths, config),
  ];

  Promise.all(promises)
    .then(() => {
      result = true;
      console.log("Post imports completed successfully.");
    })
    .catch(() => {
      console.error("Post imports failed.");
      process.exit(1);
    });

  return result;
}

export default postImports;
