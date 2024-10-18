import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../Service/user.service';
import { FolderService } from '../Service/folder.service';
import { VisibilityPopupService } from '../Service/visibilityPopup/visibility-popup.service';
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
  appliedFilters: string[] = []; // Liste des filtres appliqués
  filterValue: string = ''; // Valeur du filtre en cours de saisie
  selectedFilterType: string = 'Tag'; // Type de filtre sélectionné
  folders: Folder[] = []; // Liste de tous les dossiers
  filteredFolders: Folder[] = []; // Liste des dossiers filtrés
  favoriteFolders: string[] = []; // Liste des dossiers favoris
  selectFolderId: string = ""; // ID du dossier sélectionné
  UserId: string = ""; // ID de l'utilisateur
  isPopupOpen: boolean = false; // Indicateur pour l'état du popup

  constructor(
    private VisibilityPopupService: VisibilityPopupService, // Service pour gérer la visibilité des popups
    private userService: UserService, // Service pour gérer les utilisateurs
    private folderService: FolderService, // Service pour gérer les dossiers
    private authService: AuthService // Service pour gérer l'authentification
  ) {}

  ngOnInit() {
    this.isPopupOpen = false; // Initialise l'état du popup à fermé
    this.authService.checkAuth(); // Vérifie l'authentification de l'utilisateur
    if (this.authService.checkAuth()) {
      this.loadFolders(); // Charge les dossiers si l'utilisateur est authentifié
    }
    this.authService.authStatus$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadFolders(); // Recharge les dossiers lorsque l'utilisateur s'authentifie
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
        if (token != null) {
          this.favoriteFolders = await this.userService.getfavoriteFolders(token, userId);
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
    // Ouvre le popup
    this.isPopupOpen = true;
  }

  closePopup(): void {
    // Ferme le popup
    this.isPopupOpen = false;
  }

  addFilter() {
    // Ajoute un filtre à la liste des filtres appliqués
    if (this.filterValue.trim()) {
      this.appliedFilters.push(`${this.selectedFilterType}: ${this.filterValue}`);
      this.filterValue = '';
      this.applyFilters();
    }
  }

  removeFilter(index: number) {
    // Supprime un filtre de la liste des filtres appliqués
    this.appliedFilters.splice(index, 1);
    this.applyFilters();
  }

  applyFilters() {
    // Applique les filtres aux dossiers
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
    // Ajoute ou retire un dossier des favoris
    const foundFolder = this.favoriteFolders.find(f => f === folder.id);
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
    // Ajoute un dossier aux favoris
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');
      const userId = user ? JSON.parse(user).id : null;
      console.log('userId:', userId);

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
    // Supprime un dossier
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
    if (this.favoriteFolders.find(f => f === folder.id)) {
      this.deleteFolderFromFavorites(folder.id);
    }
    console.log('Dossier supprimé:', folder);
  }

  getHeartColor(folder: Folder): string {
    // Retourne la couleur du cœur en fonction de l'état favori du dossier
    if (this.favoriteFolders.find(f => f === folder.id)) {
      return 'red';
    }
    return 'gray';
  }

  setVisibility(value: boolean) {
    // Met à jour la visibilité du popup
    this.VisibilityPopupService.setVisibility();
    console.log('VisibilityPopupService:', value);
  }

  getVisibility() {
    // Récupère l'état de visibilité du popup
    console.log('VisibilityPopupService:', this.VisibilityPopupService.getVisibility());
    return this.VisibilityPopupService.getVisibility();
  }

  isLoggedIn(): boolean {
    // Vérifie si l'utilisateur est connecté
    return this.userService.isLoggedIn();
  }

  logout() {
    // Déconnecte l'utilisateur
    this.userService.logout();
  }

  getFolderId(folder: Folder): string {
    // Retourne l'ID du dossier
    console.log("l'id du dossier est:", folder.id);
    folder.id = this.selectFolderId;
    return folder.id;
  }

  deleteFolderFromFavorites(folderId: string) {
    // Supprime un dossier des favoris
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
    // Sélectionne un dossier et met à jour la visibilité
    this.selectFolderId = folderId;
    this.setVisibility(true);
  }
}