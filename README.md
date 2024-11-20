## Description

Server side of crypto monetary advisor project

## Node.js Version

This application requires **Node.js version 20.16.0** to run. Ensure you have this version installed for optimal compatibility.

## Environment Configuration

The application uses an .env file to manage environment-specific configurations.

You can find an example of this configuration in .env.example.
To set up your environment, copy .env.example to .env and fill in the required values before running the application.

```bash
$ cp .env.example .env
```

## Project setup

```bash
$ npm install
```

## Migrations

The application uses TypeORM migrations for database schema updates.
Run the following command to execute all pending migrations:

```bash
$ npm run migration:run
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Running the Project Using Docker Compose

The project includes a docker-compose.yaml file to simplify containerized deployment and setup.
To build and start the application and its dependencies using Docker Compose, use the following command:

```bash
$ docker compose up
```

This command will:

Build the necessary Docker images.
Start all the services defined in the docker-compose.yaml file.
Automatically link services like the application server and database.
To stop the containers, use:

```bash
$ docker compose down
```

If you need to rebuild the images after making changes to the code or configuration:

```bash
$ docker compose up --build
```

Project Structure

- .husky: Contains pre-commit and pre-push hooks to ensure type checking and unit tests pass before committing changes.
- dist: Stores the build version of the application.
- node_modules: Contains all installed dependencies and their specific versions.
- test: Includes all E2E tests and their configurations.
- .env / .env.example: Holds environment variables in a key-value format.
- eslint.config.js: Configures linting rules.
- .gitignore: Lists files and directories to be ignored when committing to the repository.
- .prettierrc: Contains code formatting rules.
- ormconfig.json: Specifies database connection settings and TypeORM configuration.
- package.json / package-lock.json: Include project metadata and dependency details.
- tsconfig.build.json / tsconfig.json: Contain TypeScript compiler configuration.
- scripts: Shell scripts for checking TypeScript types.
- src: Main application code, including all required modules.

  Modules in src

- auth: Handles user authentication and authorization with login/password functionality and token validation middleware.
- binance: Integrates with Binance API for real-time price data via WebSocket.
  - BinanceService: Fetches candle data from Binance API.
  - BinanceGateway: WebSocket gateway for subscribing to currency pairs and streaming price data.
- monobank: Supports CRUD operations for Monobank clients.
- openai: Integrates with OpenAI APIs.
- wallets: Manages cryptocurrency wallet interactions.
- users: Handles CRUD operations for user entities.

  Additional Directories in src

- database: Provides services for database interactions.
- helpers: Contains utility functions.
- migrations: Includes database migration scripts.
