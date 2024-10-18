import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisibilityPopupService {
  // BehaviorSubject pour gérer l'état de visibilité du popup
  private visibilitySubject = new BehaviorSubject<boolean>(false);

  // Méthode pour obtenir l'état de visibilité en tant qu'observable
  getVisibility() {
    return this.visibilitySubject.asObservable();
  }

  // Méthode pour inverser l'état de visibilité
  setVisibility() {
    this.visibilitySubject.next(!this.visibilitySubject.value);
  }
}