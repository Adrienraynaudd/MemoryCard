import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../Service/user.service';
import { FolderService} from '../Service/folder.service';
import { VisibilityPopupService } from '../services/visibilityPopup/visibility-popup.service';
import { PopupFolderComponent } from '../popup-folder/popup-folder.component';
import { Folder } from '../interfaces/folder';
import { AuthService } from '../Service/AuthService';
import { User } from '../interfaces/user';
import { AddCardComponent } from '../add-card/add-card.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  appliedFilters: string[] = [];
  filterValue: string = '';
  selectedFilterType: string = 'Tag';

  folders = [
    { name: 'Dossier 1', tags: ['Tag1', 'Tag2', 'Tag3'], isLiked: false },
    { name: 'Dossier 2', tags: ['TagA', 'TagB', 'TagC'], isLiked: false },
    { name: 'Dossier 3', tags: ['TagX', 'TagY', 'TagZ'], isLiked: false },
    { name: 'Dossier 4', tags: ['Tag1', 'Tag2', 'Tag5'], isLiked: false },
  ];

  filteredFolders = [...this.folders];

  addFilter() {
    if (this.filterValue.trim()) {
      this.appliedFilters.push(`${this.selectedFilterType}: ${this.filterValue}`);
      this.filterValue = '';
      this.applyFilters();
    }
  }
  removeFilter(index: number) {
    this.appliedFilters.splice(index, 1);
    this.applyFilters();
  }

  applyFilters() {
    this.filteredFolders = this.folders.filter(folder => {
      let tagsMatch = false;
      let nameMatch = false;
      tagsMatch = this.appliedFilters.filter(filter => filter.startsWith('Tag:')).every(filter => {
        const tag = filter.replace('Tag: ', '').replace(/\s+/g, '').toLowerCase();
        return folder.tags.map(t => t.replace(/\s+/g, '').toLowerCase()).includes(tag);
      });

      nameMatch = this.appliedFilters.filter(filter => filter.startsWith('Folder Name:')).every(filter => {
        const name = filter.replace('Folder Name: ', '').replace(/\s+/g, '').toLowerCase();
        return folder.title.replace(/\s+/g, '').toLowerCase().includes(name);
      });
      return tagsMatch && nameMatch;
    });
  }

  likeFolder(folder: Folder) {
    console.log('Dossier favori:', folder);
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');
    var userId = user ? JSON.parse(user).id : null;
    if(token != null && folder != null){
    this.userService.addFavoriteFolder(userId, token, folder).subscribe(
      response => {
        console.log('Réponse de l\'API:', response);
        // Traitez la réponse ici
      },
      error => {
        console.error('Erreur lors de l\'appel à l\'API:', error);
      }
    );
    }else{
      console.error('Erreur lors de l\'ajout du dossier favori home.component.ts');
    }
    }else{
      console.error('Erreur lors de l\'ajout du dossier favori home.component.ts');
    }
  }

  deleteFolder(folder: any) {
    this.folders = this.folders.filter(f => f !== folder);
    this.filteredFolders = this.filteredFolders.filter(f => f !== folder);
    console.log('Dossier supprimé:', folder.name);
  }

  getHeartColor(isFavorite: boolean): string {
    return isFavorite ? 'red' : 'gray';
  }
  setVisibility(value: boolean) {
    this.VisibilityPopupService.setVisibility();
    console.log('VisibilityPopupService:', value);
  }

  getVisibility() {
    console.log('VisibilityPopupService:', this.VisibilityPopupService.getVisibility());
    return this.VisibilityPopupService.getVisibility();
  }
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
  logout() {
    this.userService.logout();
  }

  getFolderId(folder: Folder): string {
    console.log("l'id du dossier est:", folder.id);
    folder.id = this.selectFolderId;
    return folder.id;
  }


  selectFolder(folderId: string) {
    this.selectFolderId = folderId;
    this.setVisibility(true);
  }
}
