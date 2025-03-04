import * as mongodb from 'mongodb';
import { Book } from './book';

export const collections: {
    books?: mongodb.Collection<Book>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    
    const db = client.db('bookstore');
    await applySchemaValidation(db);
    
    const booksCollection = db.collection<Book>('books'); 
    collections.books = booksCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'author', 'rating', 'pages', 'genres', 'reviews'],
            additionalProperties: false,
            properties: {
                _id: {},
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                author: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                rating: {
                    bsonType: 'int',
                    minimum: 0,
                    maximum: 10,
                    description: 'must be a integer between 0 and 10'
                },
                pages: {
                    bsonType: 'int',
                    minimum: 1,
                    description: 'must be an integer greater than 0'
                },
                genres: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'string',
                        description: 'must be an array of strings'
                    },
                    minItems: 1,
                    uniqueItems: true,
                    description: 'must be an array of unique strings'
                },
                reviews: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'object',
                        required: ['name', 'body'],
                        additionalProperties: false,
                        properties: {
                            name: {
                                bsonType: 'string',
                                description: 'must be a string and is required',
                            },
                            body: {
                                bsonType: 'string',
                                description: 'must be a string and is required',
                            },
                        },
                    },
                    minItems: 1,
                    description: 'must be an array of objects'
                },
            },
        },
    };

    await db.command({
        collMod: 'books',
        validator:  jsonSchema
        }).catch(async (error: mongodb.MongoServerError) => {
            if (error.codeName === 'NamespaceNotFound') {
                await db.createCollection('books', {
                    validator: jsonSchema
                });
            }
        });
}
