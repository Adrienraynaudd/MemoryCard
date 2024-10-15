import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../interfaces/folder';

@Injectable({
    providedIn: 'root'
})
export class FolderService {
    private apiUrl = 'http://localhost:3000/api/folders/';

    constructor(private http: HttpClient) { }

    getFolders(): Observable<Folder[]> {
        return this.http.get<Folder[]>(`${this.apiUrl}`);
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