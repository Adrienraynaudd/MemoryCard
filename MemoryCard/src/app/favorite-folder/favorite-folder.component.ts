import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../Service/user.service';
import { FolderService } from '../Service/folder.service';
import { Folder } from '../interfaces/folder';
import { VisibilityPopupService } from '../Service/visibilityPopup/visibility-popup.service';
import { PopupFolderComponent } from "../popup-folder/popup-folder.component";

@Component({
  selector: 'app-favorite-folder',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    PopupFolderComponent
  ],
  templateUrl: './favorite-folder.component.html',
  styleUrl: './favorite-folder.component.css'
})
export class FavoriteFolderComponent {
  favoriteFolders: Folder[] = []; // Liste des dossiers favoris
  allFolders: Folder[] = []; // Liste de tous les dossiers
  selectFolderId: string = ""; // ID du dossier sélectionné

  constructor(
    private folderService: FolderService, // Service pour gérer les dossiers
    private userService: UserService, // Service pour gérer les utilisateurs
    private VisibilityPopupService: VisibilityPopupService // Service pour gérer la visibilité des popups
  ) {}

  ngOnInit() {
    this.isPopupOpen = false; // Indicateur pour l'état du popup
    this.loadFavoriteFolders(); // Charge les dossiers favoris lors de l'initialisation du composant
  }
  isPopupOpen = false; // Indicateur pour l'état du popup

  openPopup(): void {
    // Ouvre le popup
    this.isPopupOpen = true;
  }

  closePopup(): void {
    // Ferme le popup et met à jour la visibilité
    this.setVisibility(false);
    this.isPopupOpen = false;
  }

  async loadFavoriteFolders() {
    // Charge les dossiers favoris de l'utilisateur
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');
      const userId = user ? JSON.parse(user).id : null;

      if (token && userId) {
        // Récupère les dossiers favoris depuis le UserService
        const favoriteFolderIds = await this.userService.getfavoriteFolders(token, userId);

        // Récupère tous les dossiers pour filtrer uniquement les favoris
        this.allFolders = await this.folderService.getFolders();
        this.favoriteFolders = this.allFolders.filter(folder => favoriteFolderIds.includes(folder.id));
      }
    }
  }

  async toggleFavorite(folder: Folder) {
    // Ajoute ou retire un dossier des favoris
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    const userId = user ? JSON.parse(user).id : null;

    if (this.favoriteFolders.find(f => f.id === folder.id) && token != null) {
      await this.userService.deleteFavoriteFolder(userId, token, folder.id);
      this.favoriteFolders = this.favoriteFolders.filter(f => f.id !== folder.id);
    }
  }

  getHeartColor(folder: Folder): string {
    // Retourne la couleur du cœur en fonction de l'état favori du dossier
    return this.favoriteFolders.find(f => f.id === folder.id) ? 'red' : 'gray';
  }

  selectFolder(folderId: string) {
    // Sélectionne un dossier et met à jour la visibilité
    this.selectFolderId = folderId;
    this.setVisibility(true);
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
}