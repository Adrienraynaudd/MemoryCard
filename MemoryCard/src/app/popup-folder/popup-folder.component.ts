import { Component, OnInit, Renderer2 } from '@angular/core';
import { VisibilityPopupService } from '../services/visibilityPopup/visibility-popup.service';
import { CommonModule } from '@angular/common';
import { CardsService } from '../services/cards/cards.service';

@Component({
  selector: 'app-popup-folder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-folder.component.html',
  styleUrl: './popup-folder.component.css',
})
export class PopupFolderComponent implements OnInit {
  visibility: boolean = false;

  constructor(
    private visibilityPopupService: VisibilityPopupService,
    private renderer: Renderer2,
    private CardsService: CardsService
  ) {}

  ngOnInit() {
    this.visibilityPopupService.getVisibility().subscribe((visibility) => {
      this.visibility = visibility;
      this.changeVisibility();
    });
    this.recupCards();
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

  recupCards() {
    this.CardsService.getAllCards().subscribe((data) => {
      console.log(data);
    });
  }
}
