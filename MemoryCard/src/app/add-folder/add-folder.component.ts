import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FolderService } from '../Service/folder.service';

@Component({
  selector: 'app-add-folder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.css']
})
export class AddFolderComponent {
  folderForm!: FormGroup; // Formulaire pour ajouter un dossier
  tags: string[] = []; // Liste des tags
  userId: string | null = null; // ID de l'utilisateur
  errorMessage: string = ''; // Message d'erreur
  @Output() folderAdded = new EventEmitter<void>(); // Événement émis lorsque le dossier est ajouté

  constructor(private fb: FormBuilder, private folderService: FolderService) {
    // Récupère l'utilisateur authentifié depuis le localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('authUser');
      this.userId = user ? JSON.parse(user).id : null;

      console.log('userId:', this.userId);
    }
    // Initialise le formulaire avec des validateurs
    this.folderForm = this.fb.group({
      title: ['', Validators.required],
      userId: [this.userId, Validators.required],
    });
  }

  addTag(tagInput: HTMLInputElement): void {
    // Ajoute un tag à la liste des tags
    const tagValue = tagInput.value.trim();
    if (tagValue) {
      this.tags.push(tagValue);
      tagInput.value = '';
    }
  }

  removeTag(index: number): void {
    // Supprime un tag de la liste des tags
    this.tags.splice(index, 1);
  }

  onSubmit(): void {
    // Soumet le formulaire pour créer un nouveau dossier
    if (this.folderForm.valid && this.tags.length > 0) {
      const folder = this.folderForm.value;
      folder.tags = this.tags;
      folder.userId = this.userId;

      this.folderService.createFolder(folder).subscribe({
        next: (response) => {
          console.log('Folder created successfully:', response);
          this.folderForm.reset();
          this.tags = [];
          this.folderAdded.emit(); // Émet l'événement pour indiquer que le dossier a été ajouté
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création du dossier';
        }
      });
    } else {
      this.errorMessage = 'Formulaire invalide ou aucun tag ajouté';
    }
  }
}