import { Component, OnInit ,WritableSignal} from '@angular/core';
import { Book } from '../book';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatButtonModule, MatCardModule, CommonModule],
  styles: [
    `
      table {
        width: 100%;

        button:first-of-type {
          margin-right: 1rem;
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Books</mat-card-title>
      </mat-card-header>
      <mat-card-content>
      <table mat-table [dataSource]="books$()">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let book">{{ book.title }}</td>
        </ng-container>
        <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef>Author</th>
            <td mat-cell *matCellDef="let book">{{ book.author }}</td>
        </ng-container>
        <ng-container matColumnDef="rating">
            <th mat-header-cell *matHeaderCellDef>Rating</th>
            <td mat-cell *matCellDef="let book">{{ book.rating }}</td>
        </ng-container>
        <ng-container matColumnDef="pages">
            <th mat-header-cell *matHeaderCellDef>Pages</th>
            <td mat-cell *matCellDef="let book">{{ book.pages }}</td>
        </ng-container>
        <ng-container matColumnDef="genre">
            <th mat-header-cell *matHeaderCellDef>Genre</th>
            <td mat-cell *matCellDef="let book">{{ book.genres }}</td>
        </ng-container>
        <ng-container matColumnDef="reviews">
            <th mat-header-cell *matHeaderCellDef>Reviews</th>
            <td mat-cell *matCellDef="let book">{{ book.reviews?.length || 0 }}</td>
        </ng-container>
        <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>Action</th>
            <td mat-cell *matCellDef="let book">
              <button mat-raised-button [routerLink]="['edit/', book._id]">
                Edit
              </button>
              <button mat-raised-button color="warn" (click)="deleteBook(book._id || '')">
                Delete
              </button>
            </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" [routerLink]="['new']">Add Book</button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class BooksListComponent implements OnInit {
  books$ = {} as WritableSignal<Book[]>;
  displayedColumns = ['title', 'author', 'rating', 'pages', 'genre', 'reviews', 'action'];
  

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  deleteBook(id: string): void {
    this.bookService.deleteBook(id).subscribe({
      next: () => this.fetchBooks(),
    });
  }

  private fetchBooks(): void {
    this.books$ = this.bookService.books$;    
    this.bookService.getBooks();
  }
}