import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
        return folder.name.replace(/\s+/g, '').toLowerCase().includes(name);
      });
      return tagsMatch && nameMatch;
    });
  }

  likeFolder(folder: any) {
    folder.isLiked = !folder.isLiked;
    console.log('J\'aime le dossier:', folder.name, folder.isLiked);
  }

  deleteFolder(folder: any) {
    this.folders = this.folders.filter(f => f !== folder);
    this.filteredFolders = this.filteredFolders.filter(f => f !== folder);
    console.log('Dossier supprimé:', folder.name);
  }

  getHeartColor(isLiked: boolean): string {
    return isLiked ? 'red' : 'gray';
  }
}
