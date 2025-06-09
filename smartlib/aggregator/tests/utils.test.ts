import { arrayGroupinBy, arrayGroupByV2 } from '../src/utils';
import { Book } from '../src/model/client';

describe('Utils', () => {
  describe('arrayGroupinBy', () => {
    it('should group an array of objects by a specified key', () => {
      // Arrange
      const items = [
        { id: 1, category: 'A', name: 'Item 1' },
        { id: 2, category: 'B', name: 'Item 2' },
        { id: 3, category: 'A', name: 'Item 3' },
        { id: 4, category: 'C', name: 'Item 4' },
        { id: 5, category: 'B', name: 'Item 5' },
      ];

      // Act
      const result = arrayGroupinBy(items, 'category');

      // Assert
      expect(result).toEqual({
        'A': [
          { id: 1, category: 'A', name: 'Item 1' },
          { id: 3, category: 'A', name: 'Item 3' },
        ],
        'B': [
          { id: 2, category: 'B', name: 'Item 2' },
          { id: 5, category: 'B', name: 'Item 5' },
        ],
        'C': [
          { id: 4, category: 'C', name: 'Item 4' },
        ],
      });
    });

    it('should return an empty object when given an empty array', () => {
      // Act
      const result = arrayGroupinBy([], 'anyKey');

      // Assert
      expect(result).toEqual({});
    });

    it('should handle keys that do not exist in some objects', () => {
      // Arrange
      const items = [
        { id: 1, category: 'A' },
        { id: 2 }, // No category
        { id: 3, category: 'B' },
      ];

      // Act
      const result = arrayGroupinBy(items, 'category');

      // Assert
      expect(result).toEqual({
        'A': [{ id: 1, category: 'A' }],
        'B': [{ id: 3, category: 'B' }],
        'undefined': [{ id: 2 }],
      });
    });
  });

  describe('arrayGroupByV2', () => {
    it('should group books by ISBN', () => {
      // Arrange
      const books: Partial<Book>[] = [
        { isbn: '123', title: 'Book 1' },
        { isbn: '456', title: 'Book 2' },
        { isbn: '123', title: 'Book 1 - Copy' },
        { isbn: '789', title: 'Book 3' },
      ] as Book[];

      // Act
      const result = arrayGroupByV2(books as Book[], (book) => book.isbn);

      // Assert
      expect(result).toEqual({
        '123': [
          { isbn: '123', title: 'Book 1' },
          { isbn: '123', title: 'Book 1 - Copy' },
        ],
        '456': [
          { isbn: '456', title: 'Book 2' },
        ],
        '789': [
          { isbn: '789', title: 'Book 3' },
        ],
      });
    });

    it('should group books by custom key function', () => {
      // Arrange
      const books: Partial<Book>[] = [
        { isbn: '123', title: 'Book A', author: 'Author 1' },
        { isbn: '456', title: 'Book B', author: 'Author 2' },
        { isbn: '789', title: 'Book C', author: 'Author 1' },
      ] as Book[];

      // Act
      const result = arrayGroupByV2(books as Book[], (book) => book.author);

      // Assert
      expect(result).toEqual({
        'Author 1': [
          { isbn: '123', title: 'Book A', author: 'Author 1' },
          { isbn: '789', title: 'Book C', author: 'Author 1' },
        ],
        'Author 2': [
          { isbn: '456', title: 'Book B', author: 'Author 2' },
        ],
      });
    });

    it('should return an empty object when given an empty array', () => {
      // Act
      const result = arrayGroupByV2([] as Book[], (book) => book.isbn);

      // Assert
      expect(result).toEqual({});
    });
  });
});