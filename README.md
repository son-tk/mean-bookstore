# MEAN Bookstore Project

A simple MEAN stack project for managing books with an Angular frontend and an Express backend, using MongoDB Atlas as the database.

## Prerequisites

- Node.js (recommended: latest LTS version)
- NPM or Yarn
- MongoDB Atlas account (free tier available)
- Angular CLI

## Project Structure

```
/bookstore-project
│── /server     # Backend (Express + MongoDB)
│── /client     # Frontend (Angular)
```

## Backend (Express + MongoDB)

### Installation

Navigate to the backend directory:

```sh
cd server
```

Install dependencies:

```sh
npm install cors dotenv express mongodb
```

### Configuration

Create a `.env` file inside the `server` directory:

```ini
ATLAS_DB_URI=your-mongodb-atlas-connection-string
```

### Start the Server

```sh
npx ts-node src/server.ts
```

The server runs on `http://localhost:3000` by default.

## Frontend (Angular)

### Installation

Navigate to the frontend directory:

```sh
cd client
```

Create the Angular project (if not already created):

```sh
ng new client --inline-template --inline-style --minimal --routing --style=css
```

Install dependencies:

```sh
npm install
```

### Add Angular Material

```sh
ng add @angular/material
```

### Start the Angular Application

```sh
ng serve -o
```

The application runs on `http://localhost:4200` by default.

## API Endpoints

The backend provides the following API endpoints:

- `GET /books` – Retrieve all books
- `GET /books/:id` – Retrieve a book by ID
- `POST /books` – Add a new book
- `PATCH /books/:id` – Update a book
- `DELETE /books/:id` – Delete a book

## License

MIT License

