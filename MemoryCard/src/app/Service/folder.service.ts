import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../interfaces/folder';

@Injectable({
    providedIn: 'root'
})
export class FolderService {
    private apiUrl = 'http://localhost:3000/api/folders/';

    constructor(private http: HttpClient) { }

    private getToken(): string | null {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    private getUser(): string | null {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            return localStorage.getItem('userId');
        }
        return null;
    }

    getFolders(): Observable<Folder[]> {
        const headers = new HttpHeaders().set('Authorization', `${this.getToken()}`);
        return this.http.get<Folder[]>(`${this.apiUrl}`, { headers });
    }

    getFolderById(id: number): Observable<Folder> {
        return this.http.get<Folder>(`${this.apiUrl}/${id}`);
    }

    getFoldersByUserId(): Observable<Folder[]> {
        const headers = new HttpHeaders().set('Authorization', `${this.getToken()}`);
        return this.http.get<Folder[]>(`${this.apiUrl}/user/${this.getUser()}`, { headers });
    }

    createFolder(folder: Folder): Observable<Folder> {
        return this.http.post<Folder>(`${this.apiUrl}`, folder);
    }

    deleteFolder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}