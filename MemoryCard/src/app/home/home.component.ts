import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
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
}
