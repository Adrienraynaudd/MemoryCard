import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardService } from '../Service/card.service';
import { FolderService } from '../Service/folder.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  cardForm: FormGroup;
  errorMessage: string | null = null;
  folders: any[] = [];
  userId: string | null = null;

  constructor(
    private cardService: CardService,
    private folderService: FolderService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.userId = localStorage.getItem('userId');
    }
    this.cardForm = this.formBuilder.group({
      question: ['', Validators.required],
      response: ['', [Validators.required]],
      userId: [this.userId, Validators.required],
      folderId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadFolders();
  }

  loadFolders() {
    console.log('test de load folder');
    if (this.userId) {
      this.folderService.getFoldersByUserId().subscribe({
        next: (folders) => {
          console.log('user Dossiers chargés', folders);
          this.folders = folders;
        },    
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des dossiers';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      const card = this.cardForm.value;
      card.userId = { userId: this.userId };
      card.folderId = { folderId: this.cardForm.get('folderId')?.value };
  
      this.cardService.createCard(card).subscribe({
        next: (response) => {
          console.log('Card created:', response);
          this.router.navigate(['/some-path']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création de la carte';
        }
      });
    }
  }
}