import * as dotenv from 'dotenv';
import express from 'express';
import Cors from 'cors';
import { connectToDatabase } from './database';
import { bookRouter } from './book.routes';

dotenv.config();

const { ATLAS_DB_URI } = process.env;

if (!ATLAS_DB_URI) {
    console.error('ATLAS_DB_URI must be provided');
    process.exit(1);
}

connectToDatabase(ATLAS_DB_URI)
.then(() => {
    const app = express();
    app.use(Cors());
    app.use("/books", bookRouter);

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch((error) => {
    console.error(error);
    process.exit(1);
});  