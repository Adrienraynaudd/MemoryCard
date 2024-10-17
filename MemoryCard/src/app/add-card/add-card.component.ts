import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CardService } from '../Service/card.service';
import { FolderService } from '../Service/folder.service';
import { CommonModule } from '@angular/common';
import { AddFolderComponent } from '../add-folder/add-folder.component';
import { Folder } from '../interfaces/folder';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddFolderComponent, RouterOutlet],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  cardForm: FormGroup;
  errorMessage: string | null = null;
  folders: Folder[] = [];
  userId: string | null = null;
  showAddFolder: boolean = false;

  constructor(
    private cardService: CardService,
    private folderService: FolderService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // Load userId from localStorage if available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('authUser');
      this.userId = user ? JSON.parse(user).id : null;
    }

    // Initialize the form
    this.cardForm = this.formBuilder.group({
      question: ['', Validators.required],
      response: ['', [Validators.required]],
      userId: [this.userId, Validators.required],
      folderId: ['', Validators.required] // To hold selected folder ID
    });
  }

  ngOnInit() {
    this.loadFolders();
  }

  // Load folders from the server
  loadFolders() {
    if (this.userId) {
      this.folderService.getFoldersByUserId().subscribe({
        next: (folders) => {
          this.folders = folders;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des dossiers';
        }
      });
    }
  }

  // Toggle the "Add Folder" form visibility
  toggleAddFolder() {
    this.showAddFolder = !this.showAddFolder;
  }

  // Refresh folder list when a new folder is added
  onFolderAdded() {
    this.loadFolders();
  }

  // Handle form submission
  onSubmit(): void {
    if (this.cardForm.valid) {
      const cardData = this.cardForm.value;

      // Submit the card data to the service
      this.cardService.createCard(cardData).subscribe({
        next: (response) => {
          console.log('Card created:', response);
          this.router.navigate(['/home']); // Navigate back to home or another desired path
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création de la carte';
        }
      });
    }
  }
}
