import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../Service/user.service';
import { FolderService} from '../Service/folder.service';
import { VisibilityPopupService } from '../services/visibilityPopup/visibility-popup.service';
import { PopupFolderComponent } from '../popup-folder/popup-folder.component';
import { Folder } from '../interfaces/folder';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    PopupFolderComponent
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

  constructor(private VisibilityPopupService: VisibilityPopupService, private userService: UserService, private folderService: FolderService) { }
/*ngOnInit() {
        this.userService.isAuthenticated$.subscribe(isAuthenticated => {
            // Mettre à jour l'interface utilisateur ici
        });
    }*/
  async ngOnInit() {
    if (this.userService.isLoggedIn()) {
        try {
            this.folders = await this.folderService.getFolders();
            this.filteredFolders = [...this.folders];
        } catch (error) {
            console.error('Erreur lors de la récupération des dossiers :', error);
        }
    } else {
        console.warn('Utilisateur non connecté. Rediriger vers la page de connexion.');
    }
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
      tagsMatch = this.appliedFilters.filter(filter => filter.startsWith('Tag:')).every(filter => {
        const tag = filter.replace('Tag: ', '').replace(/\s+/g, '').toLowerCase();
        return folder.tags.map(t => t.replace(/\s+/g, '').toLowerCase()).includes(tag);
      });

      nameMatch = this.appliedFilters.filter(filter => filter.startsWith('Folder Name:')).every(filter => {
        const name = filter.replace('Folder Name: ', '').replace(/\s+/g, '').toLowerCase();
        return folder.name.replace(/\s+/g, '').toLowerCase().includes(name);
      });
      return tagsMatch && nameMatch;
    });
  }

  likeFolder(folder: any) {
    folder.isFavorite = !folder.isFavorite;
    console.log('J\'aime le dossier:', folder.name, folder.isFavorite);
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
}
