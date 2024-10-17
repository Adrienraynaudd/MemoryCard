import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { VisibilityPopupService } from '../services/visibilityPopup/visibility-popup.service';
import { CommonModule } from '@angular/common';
// import { Card } from '../interfaces/card';
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
export class PopupFolderComponent implements OnInit {
  visibility: boolean = false;

  @Input() folderId!: number;
  cards: Card[] = [];

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

  initializeVisibility(): void {
    this.visibilityPopupService.getVisibility().subscribe((visibility) => {
      this.visibility = visibility;
      this.changeVisibility();
    });
  }

  async loadCards(): Promise<void> {
    try {
      this.cards = await this.cardService.getCards();
    } catch (error) {
      console.error('Erreur lors de la récupération des cards :', error);
    }
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

  // getCards() {
  //   this.cardService.getCards().subscribe((cards) => {
  //     console.log(cards);
  //   });
  // }

  // getFolders() {
  //   this.folderService.getFolders().then((folders) => {
  //     console.log(folders);
  //   });
  // }
}
