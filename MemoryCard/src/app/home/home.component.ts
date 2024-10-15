import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisibilityPopupService } from '../services/visibilityPopup/visibility-popup.service';
import { PopupFolderComponent } from '../popup-folder/popup-folder.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    PopupFolderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  constructor(private VisibilityPopupService: VisibilityPopupService) { }

  folders = [
    { name: 'Dossier 1', tags: ['Tag1', 'Tag2', 'Tag3'] },
    { name: 'Dossier 2', tags: ['TagA', 'TagB', 'TagC'] },
    { name: 'Dossier 3', tags: ['TagX', 'TagY', 'TagZ'] }
  ];

  likeFolder(folder: any) {
    console.log('J\'aime le dossier:', folder.name);
  }

  deleteFolder(folder: any) {
    this.folders = this.folders.filter(f => f !== folder);
    console.log('Dossier supprimé:', folder.name);
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
