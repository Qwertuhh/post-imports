import { z } from "zod";
import { Config } from "@/types/index";
import { fromError } from "zod-validation-error";
import { existsSync, readFileSync } from "fs";

const postImportsSchema = z.object({
  root: z.string(),
  delete: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  type: z.enum(["esm", "cjs"]),
  copy: z
    .array(
      z.object({
        from: z.string(),
        to: z.string(),
      })
    )
    .optional(),
  file: z
    .array(
      z.object({
        path: z.string(),
        toChange: z.string(),
        toChangeFrom: z.string(),
      })
    )
    .optional(),
  changes: z
    .array(
      z.object({
        toChange: z.string(),
        toChangeFrom: z.string(),
      })
    )
    .optional(),
  ignore: z.array(z.string()).optional(),
});

/**
 * Reads the specified JSON file and returns the `postImports` configuration.
 *
 * @param filePath - The path to the JSON file to read. Defaults to "./package.json".
 * @returns The `postImports` configuration object or an empty array if not found.
 * @throws Will log an error message if there is an issue reading or parsing the file.
 */
function getPostImportsConfig(filePath: string): Config {
  try {
    const data = readFileSync(filePath, "utf-8");
    const packageJson = JSON.parse(data);
    const config = postImportsSchema.parse(packageJson.postImports);

    //? Check if the root directory exists
    if (!existsSync(config.root)) {
      console.error(`Root directory not found: ${config.root}`);
    }
    console.log("Configiguration:\n", config);
    return config;
  } catch (error) {
    if (error instanceof Error) {
      console.error(fromError(error).toString());
    }
    throw error;
  }
}

export default getPostImportsConfig;
