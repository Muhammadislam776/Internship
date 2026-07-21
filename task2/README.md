# Book Store CRUD API

A simple Express.js API for managing books.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- GET /api/books
- GET /api/books/:id
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id

Example request body for creating a book:

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "year": 1988
}
```
