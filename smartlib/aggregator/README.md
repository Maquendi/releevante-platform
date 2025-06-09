# SmartLib Aggregator

A service that synchronizes data between the SmartLib system and external APIs.

## Overview

The SmartLib Aggregator is responsible for:

- Synchronizing transactions between the local database and remote API
- Synchronizing book information
- Synchronizing library access and settings
- Managing authentication with external services

## Project Structure

- `src/`: Source code
  - `auth/`: Authentication-related code
  - `config/`: Configuration settings
  - `htttp-client/`: HTTP client for API calls
  - `model/`: Data models
  - `sync/`: Synchronization logic
- `tests/`: Unit tests
- `dist/`: Compiled JavaScript code
- `logs/`: Application logs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Running the Application

```bash
# Start the application
npm start

# Start in development mode
npm run dev
```

## Testing

The project includes a comprehensive test suite using Jest. For more details, see the [tests/README.md](./tests/README.md) file.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

Test coverage reports are generated in the `coverage` directory when running tests.

## Docker

The application can be run in a Docker container:

```bash
# Build the Docker image
docker build -t smartlib-aggregator .

# Run the container
docker run -p 3000:3000 smartlib-aggregator
```

## Environment Variables

The application uses the following environment variables:

- `SERVER_URL`: URL of the API server
- `API_KEY`: API key for authentication (if required)

Create a `.env` file in the root directory with these variables or set them in your environment.

## License

This project is licensed under the ISC License.