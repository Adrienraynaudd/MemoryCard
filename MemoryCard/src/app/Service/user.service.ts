import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = {
    register: "http://localhost:3000/api/users/",
    login: "http://localhost:3000/api/users/login",
    updateUser: "http://localhost:3000/api/users/:id",
  }
  private tokenKey = 'authToken';
  private userKey = 'authUser';
  

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post(this.apiUrl.register, user);
  }

  login(user: User): Observable<any> {
    return this.http.post(this.apiUrl.login, user);
  }

  updateUser(user: User): Observable<any> {
    if (user.id) {
      return this.http.put(this.apiUrl.updateUser.replace(':id', user.id.toString()), user);
    } else {
      throw new Error("L'ID de l'utilisateur est manquant.");
    }
  }
  saveAuthData(token: string, user: User) {
    console.log('saveAuthData', token, user);
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Méthode pour obtenir l'utilisateur
  getUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
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
