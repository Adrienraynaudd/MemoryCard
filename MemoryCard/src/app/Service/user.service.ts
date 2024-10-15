import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { register } from 'module';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: any = {
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
      return this.http.put(this.apiUrl.updateUser, user);
    }
}
