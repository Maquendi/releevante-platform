# SmartLib Aggregator Tests

This directory contains unit tests for the SmartLib Aggregator project.

## Test Structure

The tests are organized by module:

- `utils.test.ts`: Tests for utility functions in `src/utils.ts`
- `http-client-utils.test.ts`: Tests for HTTP client utility functions in `src/htttp-client/utils.ts`
- `http-client.test.ts`: Tests for HTTP client functions in `src/htttp-client/http-client.ts`
- `synchronize-transactions.test.ts`: Tests for transaction synchronization functions in `src/sync/synchronize-transactions.ts`

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

To run a specific test file:

```bash
npm test -- -t "Utils"  # Runs tests with "Utils" in the name
```

## Test Coverage

The tests are configured to generate coverage reports. After running the tests, you can find the coverage report in the `coverage` directory.

## Adding New Tests

When adding new tests:

1. Create a new test file in the `tests` directory with the naming convention `*.test.ts`
2. Import the functions you want to test
3. Use Jest's `describe` and `it` functions to organize your tests
4. Follow the Arrange-Act-Assert pattern for test structure
5. Mock external dependencies using Jest's mocking capabilities

Example:

```typescript
import { myFunction } from '../src/myModule';

describe('My Module', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

## Mocking

For functions that have external dependencies (like database connections or API calls), use Jest's mocking capabilities:

```typescript
jest.mock('../src/dependency', () => ({
  dependencyFunction: jest.fn().mockReturnValue('mocked value'),
}));
```

## Best Practices

1. Keep tests focused on a single unit of functionality
2. Use descriptive test names that explain what is being tested
3. Test both success and error cases
4. Reset mocks between tests using `beforeEach(() => { jest.clearAllMocks(); })`
5. Avoid testing implementation details; focus on inputs and outputs