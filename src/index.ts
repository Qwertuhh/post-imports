import changeImportsOnce from "@/utils/changeImportsOnce";
import collectFilePaths from "@/utils/getAllPaths";
import getPostImportsConfig from "@/utils/getPostImportsConfig";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { Config } from "@/types";


function postImports(filePath: string = "./package.json") {
  console.log("Changing imports in files...");
  const config: Config = getPostImportsConfig(filePath);
  //* First change the file imports as specified in the config. to maintain the priority
  if (config.file) {
    for (const fileConfig of config.file) {
      let { path: filePath, toChange, toChangeFrom } = fileConfig;
      filePath = resolve(join(config.root, filePath));
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

  //? To get all files for changing imports in the files specified in the config
  const filePaths = collectFilePaths(config);

  // ? Change imports in each file
  for (const filePath of filePaths) {
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    //* Change imports in each file based on the changes specified in the config
    for (const change of config.changes) {
      const { toChange, toChangeFrom } = change;
      console.log(
        changeImportsOnce(filePath, toChange, toChangeFrom)
          ? `Changed imports in ${filePath} from ${toChangeFrom} to ${toChange}`
          : `No imports found that need updating in ${filePath}`
      );
    }
  }
  console.log("All post imports completed successfully.");
}

export default postImports;
