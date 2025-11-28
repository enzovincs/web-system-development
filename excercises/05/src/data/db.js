// src/data/db.js
let books = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: '2', title: '1984', author: 'George Orwell' }
];

export const getBooks = () => books;

export const getBookById = (id) => books.find(b => b.id === id);

export const addBook = (book) => {
    books.push(book);
    return book;
};

export const deleteBook = (id) => {
    const initialLength = books.length;
    books = books.filter(b => b.id !== id);
    return books.length < initialLength; 
};
