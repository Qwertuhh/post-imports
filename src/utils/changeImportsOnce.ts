import { readFileSync, writeFileSync } from "fs";
import { ImportInfo } from "@/types/index.js";

/**
 * Parses the specified file to extract all import statements.
 *
 * @param filePath - The path to the file to be parsed.
 * @returns An array of ImportInfo objects, each containing details of an import statement:
 *  - `import`: The imported entities as a string.
 *  - `importFrom`: The module path from which the entities are imported.
 *  - `line`: The line number in the file where the import statement is located.
 */
function getImports(filePath: string): ImportInfo[] {
  const fileContent = readFileSync(filePath, "utf-8");
  const importRegex = /import\s+([\s\S]+?)\s+from\s+['"](.+?)['"]/g;

  const imports: ImportInfo[] = [];
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push({
      import: match[1].trim(),
      importFrom: match[2],
      line: fileContent.substring(0, match.index).split("\n").length,
    });
  }

  return imports;
}

/**
 * Parses the specified file to extract all require statements.
 *
 * @param filePath - The path to the file to be parsed.
 * @returns An array of ImportInfo objects, each containing details of a require statement:
 *  - `import`: The imported entities as a string.
 *  - `importFrom`: The module path from which the entities are imported.
 *  - `line`: The line number in the file where the require statement is located.
 */
function getImportsCommonJS(filePath: string): ImportInfo[] {
  const fileContent = readFileSync(filePath, "utf-8");
  const requireRegex = /(?:const|let|var)\s+([\w${}\[\],\s]+)\s*=\s*(?:__importDefault\(\s*)?require\(\s*['"]([^'"]+)['"]\s*\)\s*\)?\s*;/g
    

  const requires: ImportInfo[] = [];
  let match: RegExpExecArray | null;

  while ((match = requireRegex.exec(fileContent)) !== null) {
    requires.push({
      import: match[1].trim(),
      importFrom: match[2],
      line: fileContent.substring(0, match.index).split("\n").length,
    });
  }
  console.log(requires);
  return requires;
}

/**
 * Replaces the import statement at the given line number in the specified file with a
 * new import statement. The new import statement is created by replacing the given
 * oldImportPath with the newImportPath in the original import statement.
 *
 * @param filePath - The path to the file to be updated.
 * @param line - The line number in the file where the import statement is located.
 * @param oldImportPath - The old import path to be replaced.
 * @param newImportPath - The new import path to replace with.
 */
function changeImport(
  filePath: string,
  line: number,
  oldImportPath: string,
  newImportPath: string
): void {
  const fileContent = readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");

  lines[line - 1] = lines[line - 1].replace(oldImportPath, newImportPath);

  writeFileSync(filePath, lines.join("\n"), "utf-8");
}

/**
 * Changes all import statements in the specified file from the given old import path
 * to the given new import path. If no imports need updating, prints a message to the
 * console indicating this.
 *
 * @param filePath - The path to the file to be updated.
 * @param oldImportPath - The old import path to be replaced.
 * @param newImportPath - The new import path to replace with.
 */
function changeImportsOnce(
  filePath: string,
  oldImportPath: string,
  newImportPath: string,
  isCommonJS = false
): boolean {
  const imports = isCommonJS
    ? getImportsCommonJS(filePath)
    : getImports(filePath);
  let changed = false;
  console.log(`Imports: ${imports}`);
  for (const imp of imports) {
    if (imp.importFrom === oldImportPath) {
      console.log(`Updating import on line ${imp.line}: ${imp.import}`);
      changeImport(filePath, imp.line, oldImportPath, newImportPath);
      changed = true;
    }
  }
  return changed;
}

export default changeImportsOnce;
export { getImports, changeImport };
