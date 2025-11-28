// src/routes/bookRoutes.js
import { Router } from 'express';
import { getAllBooks, getBook, createBook, deleteBook } from '../controllers/book.Controller.js';

const router = Router();

router.get('/', getAllBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.delete('/:id', deleteBook);

export default router;
