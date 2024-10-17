import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../interfaces/card';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private apiUrl = 'http://localhost:3000/api/cards';

    constructor(private http: HttpClient, private userService: UserService) {}
    private getToken(): string | null {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    getCards(): Observable<Card[]> {
        const headers = new HttpHeaders().set('Authorization', `${this.userService.getToken()}`);
        return this.http.get<Card[]>(`${this.apiUrl}/`, { headers });
    }

    getCardById(id: number): Observable<Card> {
        const headers = new HttpHeaders().set('Authorization', `${this.userService.getToken()}`);
        return this.http.get<Card>(`${this.apiUrl}/${id}`, { headers });
    }

    createCard(card: Card): Observable<Card> {
        const headers = new HttpHeaders().set('Authorization', `${this.userService.getToken()}`);
        return this.http.post<Card>(this.apiUrl, card, { headers });
    }

    updateCard(id: number, card: Card): Observable<Card> {
        const headers = new HttpHeaders().set('Authorization', `${this.userService.getToken()}`);
        return this.http.put<Card>(this.apiUrl, card, { headers });
    }

    deleteCard(id: number): Observable<Card> {
        const headers = new HttpHeaders().set('Authorization', `${this.userService.getToken()}`);
        return this.http.delete<Card>(`${this.apiUrl}/${id}`, { headers });
    }
}