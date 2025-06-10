# Post Imports

This Modules helps to ship with desired folder structure.

> [!NOTE]
> - This module only works after compilation. 
>
> - This is mainly use in **monorepo** projects.

## Explanation of each features

This package is for changing all imports in a directory and its subdirectories.
The changes are specified in the `postImports` field in the `package.json` file.

| Field       | Description                                                                                     |
|-------------|-------------------------------------------------------------------------------------------------|
| root        | The root directory where the files are located.                                                 |
| files       | A list of glob patterns representing the files to be considered for import changes.            |
| changes     | An array of objects, each specifying an import path to change (`toChange`) and its original path (`toChangeFrom`). |
| ignore      | A list of glob patterns for files to exclude from import changes.                               |
| file        | An array of objects, each specifying a single file with a `path`, and the import paths to change within that file. |

| Change Object Field | Description                                                       |
|---------------------|-------------------------------------------------------------------|
| toChange            | The new import path to be used.                                   |
| toChangeFrom        | The original import path to be replaced.                          |

| File Object Field   | Description                                                       |
|---------------------|-------------------------------------------------------------------|
| path                | The path to the specific file where import changes are applied.   |
| toChange            | The new import path to be used in the specified file.             |
| toChangeFrom        | The original import path to be replaced in the specified file.    |

## Example

```json
"postImports": {
    "root": "./dist",
    "files": ["**/*.js"],
    "changes": [
      {
        "toChange": "@mycompany/mylibrary",
        "toChangeFrom": "@mycompany/oldlibrary"
      },
      {
        "toChange": "../data.json",
        "toChangeFrom": "./data.json"
      }
    ],
    "ignore": ["**/*.d.ts", "**/*.map"],
    "file": [
      {
        "path": "index.js",
        "toChange": "mycustomimport",
        "toChangeFrom": "@mycompany/customimport"
      }
    ]
  },
```

## License

This project is licensed under the MIT License.
[MIT](LICENSE)
