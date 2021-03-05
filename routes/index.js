var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

//Get /books, show full list of books
router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll({
    order: [["title", "ASC"]]
  });

  // return res.json(books);
  res.render('index', {books: books, title: "All Books"});
}));

//Get /books/new, shows the create new book form
router.get('/books/new', (req, res, next) => {
  res.render('new_book');
});

//Post /books/new, posts a new book to the database
router.post('/books/new', asyncHandler(async(req, res) => {
  const book = await Book.create(req.body);
  res.render('/books/' + book.id);
}));

//Get /books/:id, shows book detail form
router.get('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update_book', {book: book, title: "Edit Book"});
}));

//Post /books/:id, updates book info in the database
router.post('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect("/books/" + book.id);
}));

//Post /books/:id/delete, deletes a book
router.post('/books/:id/delete', asyncHandler(async(req, res) => {
  res.render('update_book');
}));

module.exports = router;
