const express = require("express");
const ExpressError = require("../expressError");
const Book = require("../models/book");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");

const router = new express.Router();


/** GET / => {books: [book, ...]}  */
/** Responds with a list of all the books */
router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */
/** Responds with a single book found by its isbn */
router.get("/:isbn", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.isbn);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */
/** Creates a book and responds with the newly created book */
// router.post("/", async function (req, res, next) {
//     
// });
router.post("/", async function (req, res, next) {
    const result = jsonschema.validate(req.body, bookSchema);
    if(!result.valid){
        let listOfErrors = result.errors.map(error => error.stack);
        let err = new ExpressError(listOfErrors, 400);
        return next(err);
    }
    
    try {
        const book = await Book.create(req.body);
        return res.status(201).json({ book });
    } catch (err) {
        return next(err);
    }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */
/** Updates a book and responds with the updated book */
router.put("/:isbn", async function (req, res, next) {
    const result = jsonschema.validate(req.body, bookSchema);
    if(!result.valid){
        let listOfErrors = result.errors.map(error => error.stack);
        let err = new ExpressError(listOfErrors, 400);
        return next(err);
    }

    try {
        const book = await Book.update(req.params.isbn, req.body.book);
        return res.json({ book });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */
/** Deletes a book and responds with a message of “Book deleted” */
router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
