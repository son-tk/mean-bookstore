import { Component, OnInit } from '@angular/core';
import { BookFormComponent } from '../book-form/book-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../book';
import { MatCardModule } from '@angular/material/card';
import { signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [BookFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edit Book</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-book-form 
          [initialState]="book()"
          [isEditMode]="true"
          (formSubmitted)="editBook($event)">
        </app-book-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``
})
export class EditBookComponent implements OnInit {
  book: WritableSignal<Book | undefined> = signal(undefined);

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No book id provided');
      this.router.navigate(['/books']);
      return;
    }
    
    this.bookService.getBook(id);
    this.book = this.bookService.book$;
  }

  editBook(book: Book) {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('Book ID is missing');
      return;
    }

    book.rating = Number(book.rating);
    book.pages = Number(book.pages);
    
    this.bookService.updateBook(id, book)
      .subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          alert('Failed to update book');
          console.error('Error updating book:', err);
        }
      });
  }
}