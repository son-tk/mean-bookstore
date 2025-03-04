import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookFormComponent } from '../book-form/book-form.component';
import { Book } from '../book';
import { BookService } from '../book.service';
import { MatCardModule

 } from '@angular/material/card';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [BookFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add a New Book</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-book-form (formSubmitted)="addBook($event)"></app-book-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``
})
export class AddBookComponent {
  constructor(private bookService: BookService, private router: Router) {}

  addBook(book: Book) {
    this.bookService.createBook(book).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to add book. Please try again.');
        console.error(error);
      }, 
    });
    this.bookService.getBooks();
  }
}
