# Telegraf.js Starter

Telegram bot starter with Telegraf.js and TypeScript. Includes the following
features and tools:

-   TypeScript
-   Jest
-   Prettier
-   ESLint with Airbnb style

## How to Get Started

To begin, open your terminal and run the following command to install the
required dependencies:

```
npm install
```

For starting the server in development mode, use the following command:

```
npm run start:dev
```

To run the server in production mode, follow these steps:

```
npm run build
npm run start
```

## Environment Variables

This project relies on various environment variables for configuration. You can
set these variables either in a local `.env` file or through your hosting
environment, depending on your deployment method.

Here are the essential environment variables and their purposes:

-   `TELEGRAM_TOKEN`: Specifies the token that is used for Telegram bot.

You should create a `.env` file in the root of your project and define these
variables with their respective values.

Here is an example `.env` file:

```
TELEGRAM_TOKEN=1234567890
```

## Scripts

The [package.json](./package.json) includes several useful scripts to manage,
build, and run the project efficiently. Below is a description of each script:

### Build and Run

-   `build`

Deletes the existing `dist` folder and compiles TypeScript files based on the
`tsconfig.json` configuration.

```
npm run build
```

-   `start`

Runs the compiled JavaScript app from the `dist` directory. This should be used
after running the `build` command.

```
npm run start
```

-   `start:dev`

Runs the app in development mode using `ts-node` directly with the TypeScript
source files. Useful for quick development without building.

```
npm run start:dev
```

---

### Linting and Formatting

-   `lint`

Runs ESLint and Prettier to check for code quality and formatting issues.

-   `lint:fix`

Automatically fixes linting issues where possible.

```
npm run lint:fix
```

-   `format`

Formats the code using Prettier.

```
npm run format
```

---

### Testing

-   `test`

Runs tests using Jest.

```
npm run test
```

---

### Combined Checks

-   `check`

Runs a series of checks, including building the project, running lint checks,
and executing tests.

```
npm run check
```

---

## Contributing

Your input is welcome! If you have any interesting ideas, suggestions, or would
like to contribute through pull requests, feel free to do so.
