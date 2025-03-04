import { Injectable, signal } from '@angular/core';
import { Book } from './book';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private url = 'http://localhost:3000';
  books$ = signal<Book[]>([]);
  book$ = signal<Book>({} as Book);

  constructor(private httpClient: HttpClient) { }

  private refreshBooks() {
    this.httpClient.get<Book[]>(`${this.url}/books`)
    .subscribe(books => {
      this.books$.set(books);
    });
  }

  getBooks() {
    this.refreshBooks();
    return this.books$();
  }

  getBook(id: string) {
    this.httpClient.get<Book>(`${this.url}/books/${id}`)
    .subscribe(book => {
      this.book$.set(book);
      return this.book$();
    });
  }

  createBook(book: Book) {
    book.rating = Number(book.rating);
    book.pages = Number(book.pages);
    
    return this.httpClient.post(`${this.url}/books/`, book, { responseType: 'text' });
  }

  updateBook(id: string, book: Book) {
    book.rating = Number(book.rating);
    book.pages = Number(book.pages);

    return this.httpClient.patch(`${this.url}/books/${id}`, book, { responseType: 'text' });
  }

  deleteBook(id: string) {
      return this.httpClient.delete(`${this.url}/books/${id}`, { responseType: 'text' });
  }
}
