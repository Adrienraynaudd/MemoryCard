import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { Folder } from '../interfaces/folder';
import { Console } from 'console';
import { AnyKeys, ObjectId } from 'mongoose';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = {
    register: "http://localhost:3000/api/users/",
    login: "http://localhost:3000/api/users/login",
    updateUser: "http://localhost:3000/api/users/:id",
    FavoriteFolders: "http://localhost:3000/api/users/FavoriteFolders/:id",
    AddFavoriteFolder: "http://localhost:3000/api/users/AddFavoriteFolder/:id",
    DeleteFavoriteFolder: "http://localhost:3000/api/users/RemoveFavoriteFolder/:id",
  }
  private tokenKey = 'authToken';
  private userKey = 'authUser';
public Token: String = '';

  constructor(private http: HttpClient) { }
  async getfavoriteFolders(Token: String, userId: any): Promise<string[]> {
    try{
      this.Token = Token;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${Token}`);
      const favFolders = await this.http.get<string[]>(`${this.apiUrl.FavoriteFolders.replace(':id', userId)}`, { headers }).toPromise();
      return favFolders || [];
    }catch (error) {
      console.error('Erreur lors de la récupération des dossiers favoris :', error);
      return [];
    }
  }
  addFavoriteFolder(userId: any, Token: string, folder: Folder): Observable<any> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${Token}`);
      return this.http.post<Folder>(`${this.apiUrl.AddFavoriteFolder.replace(':id', userId.toString())}`, folder, { headers });
    }
    catch (error) {
      console.error('Erreur lors de l\'ajout du dossier favori :', error);
      return throwError(error);
    }
  }
  deleteFavoriteFolder(userId: any, Token: string, folderId: string): Observable<any> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${Token}`);
      const options = { headers };
      return this.http.post<Folder>(`${this.apiUrl.DeleteFavoriteFolder.replace(':id', userId.toString())}/${folderId}`, {}, options);
    }
    catch (error) {
      console.error('Erreur lors de la suppression du dossier favori :', error);
      return throwError(error);
    }
  }

  register(user: User): Observable<any> {
    return this.http.post(this.apiUrl.register, user);
  }

  login(user: User): Observable<any> {
    return this.http.post(this.apiUrl.login, user);
  }

  updateUser(user: User): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    if (user.id) {
      return this.http.put(this.apiUrl.updateUser.replace(':id', user.id.toString()), user, { headers });
    } else {
      throw new Error("L'ID de l'utilisateur est manquant.");
    }
  }
  saveAuthData(token: string, user: any): Promise<void> {
    this.Token = token;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return Promise.resolve();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Méthode pour obtenir l'utilisateur
  getUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Méthode pour déconnecter l'utilisateur
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}