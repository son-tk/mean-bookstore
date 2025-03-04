import * as express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from './database';

export const bookRouter = express.Router();
bookRouter.use(express.json());

// Get all books.
bookRouter.get('/', async (req, res) => {
    try {
        const books = await collections?.books?.find({}).toArray();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).send( error instanceof Error ? error.message : "Unknown error");
    }
});

// Get a single book by id.
bookRouter.get('/:id', async (req, res) => {
    try {
        const book = await collections?.books?.findOne({ _id: new ObjectId(req.params.id) });
        if (book) {
            res.status(200).send(book);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send( error instanceof Error ? error.message : "Unknown error");
    }
});

// Create a new book.
bookRouter.post('/', async (req, res) => {
    try {
        const book = req.body;
        const result = await collections?.books?.insertOne(book);
        if (result?.acknowledged) {
            res.status(201).send(`Created a new book with the id ${result.insertedId}`);
        } else {
            res.status(500).send('Failed to create a new book');
        }
    } catch (error) {
        res.status(500).send( error instanceof Error ? error.message : "Unknown error");
    }
});

// Update a book by id.
bookRouter.patch('/:id', async (req, res) => {
    try {
        const id = req?.params?.id;
        let query = { _id: new ObjectId(id)};
        const updates = req.body;

        const result = await collections?.books?.updateOne(query, { $set: updates });
        if (result && result.matchedCount) {
            res.status(200).send(`Updated book: ID ${id}`);
        } else if(!result?.matchedCount) {
            res.status(404).send(`Failed to update book: ID ${id} not found`);
        } else {
            res.status(500).send(`Failed to update book: ID ${id}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send( error instanceof Error ? error.message : "Unknown error");
    }
});

// Delete a book by id.
bookRouter.delete('/:id', async (req, res) => {
    try {
        const id = req?.params?.id;
        const result = await collections?.books?.deleteOne({ _id: new ObjectId(id) });
        if (result && result.deletedCount) {
            res.status(202).send(`Removed book: ID ${id}`);
        } else if(!result) {
            res.status(400).send(`Failed to remove book: ID ${id}`);   
        } else if(!result.deletedCount) {
            res.status(404).send(`Failed to remove book: ID ${id} not found`);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send( error instanceof Error ? error.message : "Unknown error");
    }
});