import { Component, OnInit, Renderer2 } from '@angular/core';
import { VisibilityPopupService } from '../services/visibilityPopup/visibility-popup.service';
import { CommonModule } from '@angular/common';

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
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.visibilityPopupService.getVisibility().subscribe((visibility) => {
      this.visibility = visibility;
      this.changeVisibility();
    });
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
}
