import changeImportsOnce from "@/utils/changeImportsOnce";
import collectFilePaths from "@/utils/getAllPaths";
import getPostImportsConfig from "@/utils/getPostImportsConfig";
import { existsSync } from "fs";
import { join, resolve as resolvePath } from "path";
import { Config } from "@/types";
import copyFiles from "@/utils/copyFiles";
import deleteFiles from "./utils/deleteFiles";

/**
 * Copies files as specified in the configuration.
 *
 * @param config - The configuration object to use for resolving file paths.
 * @returns Nothing.
 * @throws Will log an error message if there is an issue copying a file.
 */
function copyFilesFunction(config: Config) {
  if (config.copy) {
    for (const copyConfig of config.copy) {
      console.log("Coping files ...");
      copyFiles(config.root, copyConfig);
    }
    console.log("Coping files completed");
  }
}

/**
 * Deletes files as specified in the configuration.
 *
 * @param config - The configuration object to use for resolving file paths.
 * @returns Nothing.
 * @throws Will log an error message if there is an issue deleting a file.
 */
function deleteFilesFunction(config: Config) {
  if (config.delete) {
    for (const filePath of config.delete) {
      console.log("Deleting files ...");
      deleteFiles(resolvePath(join(config.root, filePath)));
      console.log("Deleting files completed");
    }
  }
}

/**
 * Applies priority import changes for specific files as specified in the configuration.
 *
 * Iterates over each file configuration and changes the import paths from `toChangeFrom`
 * to `toChange` for files that exist at the specified paths within the root directory.
 * Logs messages indicating whether imports were changed or if no relevant imports were found.
 * If a file does not exist at the specified path, logs an error message.
 *
 * @param config - The configuration object containing the file-specific import change details.
 * @throws Will log an error message if a specified file does not exist.
 */
function priorityFileChanges(config: Config) {
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
}

/**
 * Iterates over each file path and changes the import paths from `toChangeFrom` to
 * `toChange` for each file that exists at the specified paths within the root
 * directory. Logs messages indicating whether imports were changed or if no relevant
 * imports were found. If a file does not exist at the specified path, logs an error
 * message.
 *
 * @param filePaths - An array of file paths to change imports in.
 * @param config - The configuration object containing the import change details.
 * @throws Will log an error message if a specified file does not exist.
 */
function importsChanges(filePaths: string[], config: Config) {
  console.log("Changing imports in files...");
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
}


/**
 * Executes the post-imports processing based on the configuration specified 
 * in the given JSON file, defaulting to "./package.json". This includes 
 * copying and deleting specified files, applying priority import changes 
 * to specific files, and modifying import paths in all matched files as per 
 * the configuration.
 *
 * @param filePath - The path to the JSON configuration file. Defaults to "./package.json".
 * @returns A boolean indicating the successful completion of the post-imports process.
 * @throws Will log error messages for any file operation failures or configuration issues.
 */
function postImports(filePath: string = "./package.json"): boolean {
  const config: Config = getPostImportsConfig(filePath);
  //? To get all files for changing imports in the files specified in the config
  const filePaths = collectFilePaths(config);

  //* To copy files
  copyFilesFunction(config),
  //* To delete files
  deleteFilesFunction(config),
  //* First change the file imports as specified in the config. to maintain the priority
  priorityFileChanges(config),
  //* Change imports in each file
  importsChanges(filePaths, config),

  console.log("Post imports completed successfully.");

  return true;
}

export default postImports;
