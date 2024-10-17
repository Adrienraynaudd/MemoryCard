import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FavoriteFolderComponent } from './favorite-folder/favorite-folder.component';
import { AddCardComponent } from './add-card/add-card.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'favorite-folder', component: FavoriteFolderComponent },
    { path: 'addCardComponent', component: AddCardComponent },
    { path: '**', redirectTo: '' },
];
