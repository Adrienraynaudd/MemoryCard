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
        try {
          const folders = await this.http.get<Folder[]>(this.apiUrl).toPromise();
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