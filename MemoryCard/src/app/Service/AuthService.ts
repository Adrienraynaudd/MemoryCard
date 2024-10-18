import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Subject pour gérer l'état d'authentification
  private authStatusSubject = new Subject<boolean>();
  // Observable pour écouter les changements d'état d'authentification
  authStatus$ = this.authStatusSubject.asObservable();

  // Méthode pour émettre l'état d'authentification
  emitAuthStatus(isAuthenticated: boolean) {
    this.authStatusSubject.next(isAuthenticated);
  }

  // Méthode pour vérifier l'authentification
  checkAuth(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');
      if (token) {
        // Si un token est présent, émet l'état d'authentification comme vrai
        this.emitAuthStatus(true);
        return true;
      }
      return false;
    }
    return false;
  }
}