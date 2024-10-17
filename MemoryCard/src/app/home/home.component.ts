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
    FormsModule,
    PopupFolderComponent,
    AddCardComponent,

  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  appliedFilters: string[] = [];
  filterValue: string = '';
  selectedFilterType: string = 'Tag';
  folders: Folder[] = [];
  filteredFolders: Folder[] = [];
  favoriteFolders: string[] = [];
  selectFolderId: string = "";
  UserId: string = "";
  isPopupOpen: boolean = false;
  constructor(private VisibilityPopupService: VisibilityPopupService, private userService: UserService, private folderService: FolderService, private authService: AuthService) { }

  ngOnInit() {
    this.isPopupOpen = false;
    this.authService.checkAuth();
    if (this.authService.checkAuth()) {
        this.loadFolders();
    }
    this.authService.authStatus$.subscribe(isAuthenticated => {
        if (isAuthenticated) {
            this.loadFolders();
        }
    });
}

async loadFolders() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('authUser');
        var userId = user ? JSON.parse(user).id : null;
        this.UserId = userId;
        if(token != null ){

          this.favoriteFolders = await this.userService.getfavoriteFolders(token,userId);
          console.log('Dossiers favoris:', this.favoriteFolders);
        }
        this.folders = await this.folderService.getFolders();
        this.filteredFolders = [...this.folders];
      }
    } catch (error) {
        console.error('Erreur lors de la récupération des dossiers :', error);
    }
}



  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

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
  
      tagsMatch = this.appliedFilters
      .filter(filter => filter.startsWith('Tag:'))
      .every(filter => {
        const tag = filter.replace('Tag: ', '').trim().toLowerCase();
        return folder.tags.map(t => t.trim().toLowerCase()).includes(tag);
      });

    nameMatch = this.appliedFilters
      .filter(filter => filter.startsWith('Folder Name:'))
      .every(filter => {
        const name = filter.replace('Folder Name: ', '').trim().toLowerCase();
        return folder.title?.trim().toLowerCase().includes(name);
      });
      return tagsMatch && nameMatch;
    });
  }

  async likeFolder(folder: Folder) {
    const foundFolder = this.favoriteFolders.find(f =>  f === folder.id);
    if (foundFolder) {
      await this.deleteFolderFromFavorites(folder.id);
      this.favoriteFolders = this.favoriteFolders.filter(f => f !== folder.id);
        this.getHeartColor(folder);
        console.log('Dossier retiré des favoris:', this.favoriteFolders);
    } else {
        this.addFolderToFavorites(folder);
    }
}

addFolderToFavorites(folder: Folder) {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('authUser');
        const userId = user ? JSON.parse(user).id : null;

        if (token && folder) {
            this.userService.addFavoriteFolder(userId, token, folder).subscribe(
                response => {
                    console.log('Réponse de l\'API:', response);
                    this.favoriteFolders.push(folder.id);
                    this.getHeartColor(folder);
                    console.log('Dossier ajouté aux favoris:', this.favoriteFolders);
                },
                error => {
                    console.error('Erreur lors de l\'appel à l\'API:', error);
                }
            );
        } else {
            console.error('Erreur lors de l\'ajout du dossier favori home.component.ts');
        }
    } else {
        console.error('Erreur lors de l\'ajout du dossier favori home.component.ts');
    }
}


  deleteFolder(folder: any) {
    this.folders = this.folders.filter(f => f !== folder);
    this.filteredFolders = this.filteredFolders.filter(f => f !== folder);
    this.folderService.deleteFolder(folder.id).subscribe(
      response => {
        console.log('Réponse de l\'API:', response);
      },
      error => {
        console.error('Erreur lors de l\'appel à l\'API:', error);
      }
    );
    if (this.favoriteFolders.find(f =>  f === folder.id))
    {
      this.deleteFolderFromFavorites(folder.id);
    }
    console.log('Dossier supprimé:', folder);
  }

  getHeartColor(folder: Folder): string {
    if (this.favoriteFolders.find(f =>  f === folder.id)) {
      return 'red';
    }
    return 'gray';
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
  deleteFolderFromFavorites(folderId: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('authUser');
        const userId = user ? JSON.parse(user).id : null;

        if (token && folderId) {
            this.userService.deleteFavoriteFolder(userId, token, folderId).subscribe(
                response => {
                    console.log('Réponse de l\'API:', response);
                },
                error => {
                    console.error('Erreur lors de l\'appel à l\'API:', error);
                }
            );
        } else {
            console.error('Erreur lors de la suppression du dossier favori home.component.ts');
        }
    } else {
        console.error('Erreur lors de la suppression du dossier favori home.component.ts');
    }
  }

  selectFolder(folderId: string) {
    this.selectFolderId = folderId;
    this.setVisibility(true);
  }
}
