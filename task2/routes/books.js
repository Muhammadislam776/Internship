const express = require('express');
const router = express.Router();

let books = [
  { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 }
];

function resetBooks() {
  books = [
    { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 },
    { id: 2, title: '1984', author: 'George Orwell', year: 1949 }
  ];
}

router.get('/', (req, res) => {
  res.json(books);
});

router.post('/reset', (req, res) => {
  resetBooks();
  res.json({ message: 'Sample books restored', books });
});

router.get('/:id', (req, res) => {
  const book = books.find((item) => item.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

router.post('/', (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    year: year || null
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

router.put('/:id', (req, res) => {
  const book = books.find((item) => item.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author, year } = req.body;

  if (title) book.title = title;
  if (author) book.author = author;
  if (year !== undefined) book.year = year;

  res.json(book);
});

router.delete('/:id', (req, res) => {
  const bookIndex = books.findIndex((item) => item.id === Number(req.params.id));

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  res.json({ message: 'Book deleted successfully' });
});

module.exports = { router, resetBooks };
