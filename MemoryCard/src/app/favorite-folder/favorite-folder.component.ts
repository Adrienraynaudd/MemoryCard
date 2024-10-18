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
  favoriteFolders: Folder[] = [];
  allFolders: Folder[] = [];
  selectFolderId: string = "";

  constructor(private folderService: FolderService, private userService: UserService,private VisibilityPopupService: VisibilityPopupService) {}

  ngOnInit() {
    this.isPopupOpen = false;
    this.loadFavoriteFolders();
  }
  isPopupOpen = false;


  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.setVisibility(false);
    this.isPopupOpen = false;
  }
  async loadFavoriteFolders() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');
      const userId = user ? JSON.parse(user).id : null;

    if (token && userId) {
      // Fetch favorite folders from the UserService
      const favoriteFolderIds = await this.userService.getfavoriteFolders(token, userId);

      // Fetch all folders to filter only the favorites
      this.allFolders = await this.folderService.getFolders();
      this.favoriteFolders = this.allFolders.filter(folder => favoriteFolderIds.includes(folder.id));
    }
  }
  }

  async toggleFavorite(folder: Folder) {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    const userId = user ? JSON.parse(user).id : null;

    if (this.favoriteFolders.find(f => f.id === folder.id) && token != null) {
      await this.userService.deleteFavoriteFolder(userId, token, folder.id);
      this.favoriteFolders = this.favoriteFolders.filter(f => f.id !== folder.id);
    }
  }

  getHeartColor(folder: Folder): string {
    return this.favoriteFolders.find(f => f.id === folder.id) ? 'red' : 'gray';
  }
  selectFolder(folderId: string) {
    this.selectFolderId = folderId;
    this.setVisibility(true);
  }
  setVisibility(value: boolean) {
    this.VisibilityPopupService.setVisibility();
    console.log('VisibilityPopupService:', value);
  }

  getVisibility() {
    console.log('VisibilityPopupService:', this.VisibilityPopupService.getVisibility());
    return this.VisibilityPopupService.getVisibility();
  }
}