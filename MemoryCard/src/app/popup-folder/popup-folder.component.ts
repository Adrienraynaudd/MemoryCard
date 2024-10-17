import {
  Component,
  OnInit,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { VisibilityPopupService } from '../services/visibilityPopup/visibility-popup.service';
import { CommonModule } from '@angular/common';
import { CardService } from '../Service/card.service';
import { FolderService } from '../Service/folder.service';
import { Card } from '../interfaces/card';

@Component({
  selector: 'app-popup-folder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-folder.component.html',
  styleUrl: './popup-folder.component.css',
})
export class PopupFolderComponent implements OnInit, OnChanges {
  @Input() folderId!: string;
  visibility: boolean = false;
  cards: Card[] = [];
  filteredCards: Card[] = [];

  constructor(
    private visibilityPopupService: VisibilityPopupService,
    private renderer: Renderer2,
    private cardService: CardService,
    private folderService: FolderService
  ) {}

  ngOnInit() {
    this.initializeVisibility();
    this.loadCards();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['folderId']) {
      console.log('folderId changed:', this.folderId);
      this.filterCards();
    }
  }

  initializeVisibility(): void {
    this.visibilityPopupService.getVisibility().subscribe((visibility) => {
      this.visibility = visibility;
      this.changeVisibility();
    });
  }

  async loadCards(): Promise<void> {
    try {
      this.cards = await this.cardService.getCards();
      console.log('Cards loaded:', this.cards);
      this.filterCards();
    } catch (error) {
      console.error('Erreur lors de la récupération des cards :', error);
    }
  }
  filterCards(): void {
    console.log('Filtering cards with folderId:', this.folderId);
    this.filteredCards = this.cards.filter(
      (card) => card.folderId.folderId === this.folderId 
    );
    
    console.log('Filtered cards:', this.filteredCards);
  }
  changeVisibility(): void {
    const element = this.renderer.selectRootElement('#listAllCards', true);
    if (element) {
      this.renderer.setStyle(
        element,
        'visibility',
        this.visibility ? 'visible' : 'hidden'
      );
    }
  }

  changeVisibilityPopup(): void {
    const element = this.renderer.selectRootElement('#listAllCards', true);
    if (element) {
      this.renderer.setStyle(
        element,
        'visibility',
        this.visibility ? 'hidden' : 'visible'
      );
    }
  }
}
