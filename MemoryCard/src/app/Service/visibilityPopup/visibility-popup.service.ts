import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisibilityPopupService {
  private visibilitySubject = new BehaviorSubject<boolean>(false);

  getVisibility() {
    return this.visibilitySubject.asObservable();
  }

  setVisibility() {
    this.visibilitySubject.next(!this.visibilitySubject.value);
  }
}
