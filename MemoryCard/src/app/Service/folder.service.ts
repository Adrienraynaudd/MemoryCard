import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../interfaces/folder';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class FolderService {
    private apiUrl = 'http://localhost:3000/api/folders/';

    constructor(private http: HttpClient, private userService: UserService) { }

    async getFolders(): Promise<Folder[]> {
        const token = this.userService.getToken();
        if (!token) {
          console.error('Aucun token trouvé');
          return [];
        }
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`  // Ajoute le token dans l'en-tête Authorization
        });
      
        try {
          const folders = await this.http.get<Folder[]>(this.apiUrl, { headers }).toPromise();
          return folders || [];
        } catch (error) {
          console.error('Erreur lors de la récupération des dossiers :', error);
          return [];
        }
      }

    getFolderById(id: number): Observable<Folder> {
        return this.http.get<Folder>(`${this.apiUrl}/${id}`);
    }

    createFolder(folder: Folder): Observable<Folder> {
        return this.http.post<Folder>(`${this.apiUrl}`, folder);
    }

    deleteFolder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}