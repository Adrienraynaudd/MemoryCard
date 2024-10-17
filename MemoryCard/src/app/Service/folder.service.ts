import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../interfaces/folder';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private apiUrl = 'http://localhost:3000/api/folders';

  constructor(private http: HttpClient, private userService: UserService) {}

  async getFolders(): Promise<Folder[]> {
    try {
      const folders = await this.http.get<Folder[]>(this.apiUrl).toPromise();
      return folders || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des dossiers :', error);
      return [];
    }
  }
    private getToken(): string | null {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem("authToken");
      }
      return null;
    }

    private getUser(): string | null {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            return localStorage.getItem('authUser');
        }
        return null;
    }

  getFolderById(id: number): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}/${id}`);
  }

    getFoldersByUserId(): Observable<Folder[]> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
        const user = localStorage.getItem('authUser');
        var userId = user ? JSON.parse(user).id : null;
        return this.http.get<Folder[]>(`${this.apiUrl}/user/${userId}`, { headers });
    }

    createFolder(folder: Folder): Observable<Folder> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
        return this.http.post<Folder>(`${this.apiUrl}/`, folder, {headers});
    }

  deleteFolder(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers});
  }
}