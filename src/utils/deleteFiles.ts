import { existsSync, rmSync } from "fs";

/**
 * Deletes the specified file or directory. If the file/directory does not exist
 * a warning message is logged and the function returns false. If there is an
 * error deleting the file/directory an error message is logged and the function
 * returns false. Otherwise, the function logs a success message and returns true.
 * @param {string} path The path to the file or directory to be deleted.
 * @returns {boolean} True if the file/directory was deleted successfully, false otherwise.
 */
function deleteFiles(path: string): boolean {
  if (!existsSync(path)) {
    console.error(`File ${path} not found`);
    return false;
  }
  
  try {
    rmSync(path, { recursive: true, force: true });
    console.log(`File ${path} deleted successfully!`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${path}:`, error);
    return false;
  }
}

export default deleteFiles;

