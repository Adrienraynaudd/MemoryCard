import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../interfaces/card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = 'http://localhost:3000/api/cards';

  constructor(private http: HttpClient) {}

  // getCards(): Observable<Card[]> {
  //     return this.http.get<Card[]>(`${this.apiUrl}/`);
  // }

  async getCards(): Promise<Card[]> {
    
    try {
      const cards = await this.http.get<Card[]>(`${this.apiUrl}/`).toPromise();
      return cards || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des cards :', error);
      return [];
    }
  }

  getCardById(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`);
  }

  createCard(card: Card): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, card);
  }

  updateCard(id: number, card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
