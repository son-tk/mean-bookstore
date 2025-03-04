import { Routes } from '@angular/router';
import { BooksListComponent } from './books-list/books-list.component';
import { AddBookComponent } from './add-book/add-book.component';
import { EditBookComponent } from './edit-book/edit-book.component';

export const routes: Routes = [
    { path: '', component: BooksListComponent, title: 'Books List' },
    { path: 'new', component: AddBookComponent, title: 'Add New Book' },
    { path: 'edit/:id', component: EditBookComponent, title: 'Edit Book' }
];
