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
router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  return res.json(books);
}));

//Get /books, show full list of books
router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  return res.json(books);
}));

//Get /books/new, shows the create new book form
router.get('/books/new', (req, res, next) => {
  res.render('new_book');
});

//Post /books/new, posts a new book to the database

//Get /books/:id, shows book detail form

//Post /books/:id, updates book info in the database

//Post /books/:id/delete, deletes a book

module.exports = router;
