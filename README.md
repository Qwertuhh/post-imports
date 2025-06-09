# Post Imports

This Modules helps to ship

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
        "toChange": "lodash-es",
        "toChangeFrom": "lodash"
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
