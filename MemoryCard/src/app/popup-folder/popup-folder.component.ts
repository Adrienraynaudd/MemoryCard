import {
  Component,
  OnInit,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { VisibilityPopupService } from '../Service/visibilityPopup/visibility-popup.service';
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
  @Input() folderId!: string; // ID du dossier sélectionné
  visibility: boolean = false; // Indicateur de visibilité du popup
  cards: Card[] = []; // Liste de toutes les cartes
  filteredCards: Card[] = []; // Liste des cartes filtrées par dossier

  constructor(
    private visibilityPopupService: VisibilityPopupService, // Service pour gérer la visibilité des popups
    private renderer: Renderer2, // Service pour manipuler le DOM
    private cardService: CardService, // Service pour gérer les cartes
    private folderService: FolderService // Service pour gérer les dossiers
  ) {}

  ngOnInit() {
    // Initialise la visibilité et charge les cartes lors de l'initialisation du composant
    this.initializeVisibility();
    this.loadCards();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Filtre les cartes lorsque l'ID du dossier change
    if (changes['folderId']) {
      console.log('folderId changed:', this.folderId);
      this.filterCards();
    }
  }

  initializeVisibility(): void {
    // Initialise la visibilité du popup en s'abonnant au service de visibilité
    this.visibilityPopupService.getVisibility().subscribe((visibility) => {
      this.visibility = visibility;
      this.changeVisibility();
    });
  }

  async loadCards(): Promise<void> {
    // Charge les cartes depuis le service de cartes
    try {
      this.cardService.getCards().subscribe(
        (cards) => {
          this.cards = cards;
          console.log('Cards loaded:', this.cards);
          this.filterCards();
        },
        (error) => {
          console.error('Erreur lors de la récupération des cards :', error);
        }
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des cards :', error);
    }
  }

  filterCards(): void {
    // Filtre les cartes en fonction de l'ID du dossier
    console.log('Filtering cards with folderId:', this.folderId);
    this.filteredCards = this.cards.filter(
      (card) => card.folderId === this.folderId 
    );
    console.log('Filtered cards:', this.filteredCards);
  }

  changeVisibility(): void {
    // Change la visibilité du popup en fonction de l'état de visibilité
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
    // Change la visibilité du popup manuellement
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