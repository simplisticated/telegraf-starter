# Telegraf.js Starter

Telegram bot starter with Telegraf.js and TypeScript. Includes the following
features and tools:

-   TypeScript
-   Express
-   Jest
-   Prettier
-   ESLint with Airbnb style
-   TypeORM
-   100% automatic user management with SQLite database
-   Built-in API server

## How to Get Started

To begin, open your terminal and run the following command to install the
required dependencies:

```
npm install
```

Next, set up the [environment variables](#environment-variables): create a
`.env` file and add the required values.

Then, run the database migrations (this will create the SQLite database on the
first run):

```
npm run typeorm:migration:run
```

If you're going to start API server with HTTPS, put `key.pem` and `cert.pem` in
the `certificates` folder and set the `USE_HTTPS` environment variable to
`true`.

For starting the server in development mode, use the following command:

```
npm run dev
```

To run the server in production mode, follow these steps:

```
npm run build
npm run start
```

## How to Use the Project

To extend functionality of the bot:

-   Add new [scenes](./src/bot/scenes/index.ts) and register them in the
    [stage middleware](./src/bot/middleware/private/stage.ts).
-   Implement additional middleware in the
    [middleware directory](./src/bot/middleware/private/private-message-without-scene.ts)
    when needed.

To extend functionality of the server, add new
[endpoints](./src/server/create.ts).

## Environment Variables

This project relies on various environment variables for configuration. You can
set these variables either in a local `.env` file or through your hosting
environment, depending on your deployment method.

Here are the essential environment variables and their purposes:

-   `TELEGRAM_TOKEN`: Specifies the token that is used for Telegram bot.
-   `APP_ENVIRONMENT`: `production`, `test`, or `local`. See more information
    [here](#app-environment). If not defined, `local` will be used by default.
-   `LOG_TIMEZONE`: Name of the timezone that will be used for console output.
    -   This should be a timezone string, for example: `UTC`, `Europe/London`,
        `America/New_York`, etc.
    -   This value will be passed to the `timeZone` field in
        `DateTimeFormatOptions` for logging purposes.
-   `SERVER_HOSTNAME`: Public name of the host. This variable is optional. If
    it's not set, the local network will be used.
-   `SERVER_PORT`: Defines the port on which the server will listen. If not
    provided, the default port is 3000.
-   `USE_HTTPS`: If set to `true`, HTTPS will be used for the server. By
    default, the value is `false`.
-   `LOG_SERVER_REQUESTS`: This variable controls whether request logging is
    enabled. When set to `true`, the server logs requests, including the date,
    HTTP method, URL, and request body.

You should create a `.env` file in the root of your project and define these
variables with their respective values.

Here is an example `.env` file:

```
TELEGRAM_TOKEN=1234567890
APP_ENVIRONMENT=local
LOG_TIMEZONE=America/New_York
SERVER_PORT=3000
USE_HTTPS=true
LOG_SERVER_REQUESTS=true
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

-   `dev`

Runs the app in development mode using `ts-node` directly with the TypeScript
source files. Useful for quick development without building.

```
npm run dev
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
-   `internal` - internal test environment, similar to `production` but not
    publicly available;
-   `local` - local development, where more relaxed rules may apply: logging,
    test features, etc.

The current environment is defined by the `APP_ENVIRONMENT` value in the `.env`
file. If the value is not set, it defaults to `local`. You can get the current
environment value anywhere in the project using `CURRENT_ENVIRONMENT`.

Example usage:

```typescript
import { AppEnvironment } from "./app/environment";
import ENV from "./app/env";

if (ENV.APP_ENVIRONMENT === AppEnvironment.production) {
    // The bot is in production mode
}
```

## Database

This project uses SQLite by default to keep the starter lightweight and easy to
deploy. The data is managed through TypeORM. The database file is located at

```
data/<APP_ENVIRONMENT>/database.sqlite
```

For instance, if the `APP_ENVIRONMENT` is set to `production`, the database path
would be

```
data/production/database.sqlite
```

Database interactions are facilitated by the [STORE](./src/data/store/store.ts)
object, which offers essential methods for reading and writing data models.

## User Management

This project uses a clear separation of models to manage users in an environment
with multiple bots. User-related data is distributed across several models, each
responsible for a specific level of abstraction.

The core models involved are:

-   `BotModel` — represents a Telegram bot managed by the platform;
-   `TelegramProfileModel` — represents a Telegram account;
-   `UserModel` — represents a user in the context of a specific bot;
-   `SessionModel` — stores session data managed by Telegraf.

### Interaction between `BotModel`, `UserModel`, and `TelegramProfileModel`

The relationship between the models is structured as follows:

-   A bot (`BotModel`) can have many users.
-   A Telegram profile (`TelegramProfileModel`) represents a single Telegram
    account and can participate in multiple bots.
-   A User (`UserModel`) links a Telegram profile to a specific bot and stores
    bot-specific state and permissions.

In other words, a `UserModel` record represents the combination of:

-   one Telegram account (`TelegramProfileModel`)
-   one bot (`BotModel`)

This design allows the same Telegram user to interact with multiple bots while
having:

-   different roles,
-   different permissions,
-   different state

in each bot independently.

### `BotModel`

`BotModel` represents a Telegram bot registered in the platform.

It stores data received from the Telegram Bot API, such as:

-   `telegram_id` — unique Telegram bot ID;
-   `username`;
-   bot capability flags (e.g. group support, inline queries).

Each bot may be associated with multiple `UserModel` records, one for each
Telegram profile interacting with the bot.

The bot data is [automatically updated](./src/middleware/bot-data.ts) whenever a
Telegram update is received, keeping it in sync with the latest Telegram state.

### `TelegramProfileModel`

`TelegramProfileModel` represents a Telegram account, independent of any
specific bot.

It stores Telegram-level data, including:

-   `telegram_id` — unique Telegram user or bot ID;
-   `is_bot` flag;
-   `first_name`, `last_name`, `username`;
-   `language_code`;
-   `is_premium` flag;
-   other data provided by the Telegram Bot API.

A single `TelegramProfileModel` may be associated with multiple UserModel
records — one per bot. This ensures that Telegram account data is stored once
and reused across all bots.

The profile data is [automatically updated](./src/middleware/user-data.ts)
whenever a Telegram update is received, keeping it in sync with the latest
Telegram state.

### `UserModel`

`UserModel` represents a user within a specific bot.

It contains platform-level and bot-specific data, such as:

-   `is_administrator` — whether the user has administrative privileges in the
    bot;
-   `is_blocked` — whether the user is
    [blocked](./src/middleware/check-if-blocked.ts) in the bot;
-   references to the associated `BotModel` and `TelegramProfileModel`.

Administrative privileges and blocking are bot-specific and do not affect the
user in other bots.

### `SessionModel`

`SessionModel` is used to store session data for Telegram updates.

This model is intentionally kept generic and does not enforce any schema on the
stored data. The contents of the state field are fully managed by the Telegraf
library via its
[SessionStore](https://github.com/telegraf/telegraf/blob/v4/src/session.ts)
mechanism.

The project treats session data as opaque storage:

-   it persists session state,
-   but does not modify its structure.

This approach ensures full compatibility with Telegraf’s session and scene
system, while keeping session management separated from the platform’s domain
models.

## Data Management

All database interactions in the project are performed through the
[STORE](./src/data/store/store.ts) object.

`STORE` acts as a high-level abstraction over TypeORM and provides a simple,
stable API for working with the project’s data models. This allows you to manage
users and bots without interacting with the database or ORM directly.

### Common User Operations

#### Providing administrator privileges

To make a user an administrator for a specific bot, set
`is_administrator = true` for the corresponding user record.

Example:

```typescript
await STORE.setAdministrator(telegramId, botId, true);
```

To check whether a user is an administrator:

```typescript
await STORE.isAdministrator(telegramId, botId);
```

#### Blocking users

To block a user in a specific bot, set `is_blocked = true`:

```typescript
await STORE.setBlocked(telegramId, botId, true);
```

To check whether a user is blocked:

```typescript
const isBlocked = await STORE.isBlocked(telegramId, botId);
```

## Contributing

Your input is welcome! If you have any interesting ideas, suggestions, or would
like to contribute through pull requests, feel free to do so.
