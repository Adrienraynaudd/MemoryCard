import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../interfaces/card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  // URL de l'API pour les cartes
  private apiUrl = 'http://localhost:3000/api/cards';

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir le token d'authentification depuis le localStorage
  private getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Méthode pour récupérer toutes les cartes
  getCards(): Observable<Card[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<Card[]>(this.apiUrl, { headers });
  }

  // Méthode pour récupérer une carte par son ID
  getCardById(id: number): Observable<Card> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<Card>(`${this.apiUrl}/${id}`, { headers });
  }

  // Méthode pour créer une nouvelle carte
  createCard(card: Card): Observable<Card> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<Card>(`${this.apiUrl}/`, card, { headers });
  }

  // Méthode pour mettre à jour une carte par son ID
  updateCard(id: number, card: Card): Observable<Card> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card, { headers });
  }

  // Méthode pour supprimer une carte par son ID
  deleteCard(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}