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
}
