var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

const pageSize = 8

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

function createPaginationButtons(count, pageSize) {
  const numberOfButtons = count/pageSize;
  let buttons = [];

  for (i=0; i<numberOfButtons; i++) {
    let value = i+1;
    buttons.push(value);
  }

  return buttons;
}

//Redirects to home page
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

router.get('/books', (req, res, next) => {
  res.redirect('/books/page/1');
})

//Get /books, show full list of books
router.get('/books/page/:id', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll({
    limit: pageSize,
    offset: (pageSize * req.params.id) - pageSize,
    order: [["id", "ASC"]]
  });
  const count = await Book.count();
  const buttons = createPaginationButtons(count, pageSize)
  // return res.json(books);
  res.render('index', {books: books, title: "All Books", buttons: buttons});
}));

//Get /books/new, shows the create new book form
router.get('/books/new', (req, res, next) => {
  res.render('new_book');
});

//Post /books/new, posts a new book to the database
router.post('/books/new', asyncHandler(async(req, res) => {

  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new_book", {book: book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));

//Get /books/:id, shows book detail form
router.get('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update_book', {book: book});
}));

//Post /books/:id, updates book info in the database
router.post('/books/:id', asyncHandler(async(req, res) => {

  let book; 
  try {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render(`update_book`, { book: book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));

//Post /books/:id/delete, deletes a book
router.post('/books/:id/delete', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

module.exports = router;
