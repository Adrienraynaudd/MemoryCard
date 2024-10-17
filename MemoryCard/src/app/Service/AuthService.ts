import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusSubject = new Subject<boolean>();
  authStatus$ = this.authStatusSubject.asObservable();

  emitAuthStatus(isAuthenticated: boolean) {
    this.authStatusSubject.next(isAuthenticated);
}
      checkAuth(): boolean {
        if (typeof window !== 'undefined' && window.localStorage) {
     const token = localStorage.getItem('authToken');
     const user = localStorage.getItem('authUser');
     if (token) {
        this.emitAuthStatus(true);
        return true;
     }
     return false;
    }
    return false;
    }

}
