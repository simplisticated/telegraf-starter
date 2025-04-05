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
-   `APP_ENVIRONMENT`: `production`, `test`, or `local`. See more information
    [here](#app-environment).

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

## App Environment

The `AppEnvironment` type defines the environment in which the app is running.
It allows you to write conditional algorithm based on whether the app is in
development, testing, or production.

There are three environment types:

-   `production` - the environment used in production deployments;
-   `test` - internal test environment, similar to `production` but not publicly
    available;
-   `local` - local development, where more relaxed rules may apply: logging,
    test features, etc.

The current environment is defined by the `APP_ENVIRONMENT` value in the `.env`
file. If the value is not set, it defaults to `local`. You can get the current
environment value anywhere in the project using `CURRENT_ENVIRONMENT`.

Example usage:

```typescript
import { AppEnvironment, CURRENT_ENVIRONMENT } from "./app/environment";

if (CURRENT_ENVIRONMENT === AppEnvironment.production) {
    // The bot is in production mode
}
```

You can also define environment-specific values:

```typescript
import { getValueForCurrentEnvironment } from "./app/environment";

const apiUrl = getValueForCurrentEnvironment({
    production: "https://api.server.com",
    test: "https://api-test.server.com",
    local: "http://localhost:3000",
});
```

## User Management

This project uses two main models to manage users:

### `UserModel`

Represents a platform user. Key fields include:

-   `id` - unique user identifier;
-   `is_administrator` - flag indicating whether the user is an administrator
    (default is `0`);
-   `is_blocked` - user block flag (default is `0`).

To make a user an administrator: set `is_administrator = 1` in the database.

To check if the user is administrator, use:

```typescript
const isAdministrator = await STORE.isAdministrator(telegramId);
```

To block a user: set `is_blocked = 1` in the database.

To check if the user is blocked, use:

```typescript
const isBlocked = await STORE.isBlocked(telegramId);
```

### `TelegramProfileModel`

Associated with `UserModel`, this model stores Telegram-specific data:

-   `telegram_id` - the user’s Telegram ID;
-   `username` - Telegram username;
-   other data received from the Telegram Bot API.

The data in `TelegramProfileModel` is automatically updated every time the user
sends a message, keeping the profile information in the database up to date.

## Contributing

Your input is welcome! If you have any interesting ideas, suggestions, or would
like to contribute through pull requests, feel free to do so.
