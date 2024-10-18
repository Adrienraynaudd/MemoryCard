import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../interfaces/folder';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  // URL de l'API pour les dossiers
  private apiUrl = 'http://localhost:3000/api/folders';

  constructor(private http: HttpClient, private userService: UserService) {}

  // Méthode pour récupérer tous les dossiers
  async getFolders(): Promise<Folder[]> {
    try {
      const folders = await this.http.get<Folder[]>(this.apiUrl).toPromise();
      return folders || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des dossiers :', error);
      return [];
    }
  }

  // Méthode pour obtenir le token d'authentification depuis le localStorage
  private getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  // Méthode pour obtenir l'utilisateur depuis le localStorage
  private getUser(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('authUser');
    }
    return null;
  }

  // Méthode pour récupérer un dossier par son ID
  getFolderById(id: number): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour récupérer les dossiers par ID utilisateur
  getFoldersByUserId(): Observable<Folder[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    const user = localStorage.getItem('authUser');
    var userId = user ? JSON.parse(user).id : null;
    return this.http.get<Folder[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  // Méthode pour créer un nouveau dossier
  createFolder(folder: Folder): Observable<Folder> {
    console.log('Folder:', folder);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<Folder>(`${this.apiUrl}/`, folder, { headers });
  }

  // Méthode pour supprimer un dossier par son ID
  deleteFolder(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}