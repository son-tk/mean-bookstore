import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { Book } from '../book';
import { Review } from '../review';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    NgFor
  ],
  template: `
    <form class="book-form" 
      autocomplete="off" 
      [formGroup]="bookForm"  
      (submit)="onSubmit()"
    >
      <mat-form-field>
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" placeholder="Title" required />
        @if (title?.invalid) {
          <mat-error>Title is required</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Author</mat-label>
        <input matInput formControlName="author" placeholder="Author" required />
        @if (author?.invalid) {
          <mat-error>Author is required</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Rating</mat-label>
        <input matInput formControlName="rating" placeholder="Rating" required />
        @if (rating?.invalid) {
          <mat-error>Rating is required</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Pages</mat-label>
        <input matInput formControlName="pages" placeholder="Pages" required />
        @if (pages?.invalid) {
          <mat-error>Pages is required</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Genre</mat-label>
        <mat-select formControlName="genre" required multiple>
          <mat-option *ngFor="let genre of genres" [value]="genre">{{ genre }}</mat-option>
        </mat-select>
        @if (genre?.invalid) {
          <mat-error>Genre is required</mat-error>
        }
      </mat-form-field>

      <div formGroupName="review">
        <mat-form-field>
          <mat-label>Reviewer Name</mat-label>
          <input matInput formControlName="name" placeholder="Add a reviewer name">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Review Text</mat-label>
          <textarea matInput formControlName="body" placeholder="Add a review"></textarea>
        </mat-form-field>
      </div>
      
      <button mat-raised-button color="primary" type="submit" [disabled]="bookForm.invalid">
        {{ isEditMode() ? 'Update' : 'Add'  }}
      </button>
    </form>
  `,
  styles: `
    .book-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `
})
export class BookFormComponent {
  initialState = input<Book>();
  genres: string[] = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Mystery', 'Romance'];
  isEditMode = input<boolean>(false);
  
  @Output()
  formValuesChanged = new EventEmitter<Book>();

  @Output()
  formSubmitted = new EventEmitter<Book>();

  bookForm;

  constructor(private formBuilder: FormBuilder) {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      rating: [0, Validators.required],
      pages: [0, Validators.required],
      genre: [[] as string[], Validators.required],
      review: this.formBuilder.group({
        name: [''],
        body: ['']
      }) 
    });

    effect(() => {
      const book = this.initialState();
      if (book) {
        const reviewText = book.reviews && book.reviews.length > 0 ? book.reviews[0].body : '';
        const reviewerName = book.reviews && book.reviews.length > 0 ? book.reviews[0].name : ''; 
        
        this.bookForm.patchValue({
          title: book.title || '',
          author: book.author || '',
          rating: Number(book.rating) || 0,
          pages: Number(book.pages) || 0,
          genre: book.genres || [],
          review: {
            name: reviewerName || '',
            body: reviewText || ''	
          }
        });
      }
    });
  }

  get title() {
    return this.bookForm.get('title');
  }

  get author() {
    return this.bookForm.get('author');
  }

  get rating() {
    return this.bookForm.get('rating');
  }

  get pages() {
    return this.bookForm.get('pages');
  }

  get genre() {
    return this.bookForm.get('genre');
  }

  get reviewName() {
    return this.bookForm.get('review.name');
  }

  get reviewBody() {
    return this.bookForm.get('review.body');
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      
      const reviews: Review[] = [];
      if (formValue.review) {
        reviews.push({
          name: formValue.review.name as string || 'Anonymous',
          body: formValue.review.body as string || ''
        });
      }
      
      const book: Book = {
        title: formValue.title as string || '',
        author: formValue.author as string || '',
        rating: formValue.rating as number || 0,
        pages: formValue.pages as number || 0,
        genres: formValue.genre as string[] || [],
        reviews: reviews
      };
      
      this.formSubmitted.emit(book);
    }
  }
}