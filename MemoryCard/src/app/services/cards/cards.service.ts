import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  constructor(private http: HttpClient) {}

  // http://localhost:3000/api/cards/


  getAllCards() {
    const headers = new HttpHeaders().set('Authorization', `${this.getToken()}`);
    return this.http.get('http://localhost:3000/api/cards/', { headers });
  }

    private getToken() {
      return localStorage.getItem('authToken');
    }

}
