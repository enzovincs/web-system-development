// src/controllers/bookController.js
import * as db from '../data/db.js';

// GET /books
export const getAllBooks = (req, res) => {
    const books = db.getBooks();
    res.json(books);
};

// GET /books/:id
export const getBook = (req, res) => {
    const book = db.getBookById(req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
};

// POST /books
export const createBook = (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }

    const newBook = {
        id: Date.now().toString(),
        title,
        author
    };

    db.addBook(newBook);
    res.status(201).json(newBook);
};

// DELETE /books/:id
export const deleteBook = (req, res) => {
    const success = db.deleteBook(req.params.id);
    if (success) {
        res.status(204).end(); 
    } else {
        res.status(404).json({ error: 'Book not found' }); 
        
    }
};
