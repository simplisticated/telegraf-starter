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

## Contributing

Your input is welcome! If you have any interesting ideas, suggestions, or would
like to contribute through pull requests, feel free to do so.
