module.exports = {
    root: true,
    extends: [
        "airbnb",
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    rules: {
        "import/extensions": [
            "error",
            {
                js: "never",
                ts: "never",
                json: "always",
            },
        ],
        "import/no-unresolved": "off",
        "no-console": "off",
        "no-use-before-define": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "no-underscore-dangle": [
            "error",
            {
                allowAfterThis: true,
            },
        ],
        "@typescript-eslint/no-explicit-any": "off",
    },
    ignorePatterns: [
        "dist/",
        "package-scripts/",
        ".eslintrc.js",
        "jest.config.js",
        "*-migration.ts",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    overrides: [
        {
            files: ["src/data/models/**/*.ts"],
            excludedFiles: ["src/data/models/index.ts"],
            rules: {
                "import/no-cycle": "off",
            },
        },
    ],
};
