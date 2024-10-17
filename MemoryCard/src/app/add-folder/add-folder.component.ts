import { Component } from '@angular/core';
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
  folderForm!: FormGroup;
  tags: string[] = [];
  userId: string | null = null;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private folderService: FolderService) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.userId = localStorage.getItem('userId');
    }
    this.folderForm = this.fb.group({
      title: ['', Validators.required],
      tags: ['', Validators.required],
      userId: [this.userId, Validators.required],
    });
  }

  addTag(tagInput: HTMLInputElement): void {
    const tagValue = tagInput.value.trim();
    if (tagValue) {
      this.tags.push(tagValue);
      tagInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.folderForm.valid && this.tags.length === 1) {
      const folder = this.folderForm.value;
      folder.userId = { userId: this.userId };

      this.folderService.createFolder(folder).subscribe({
        next: (response) => {
          console.log('Folder created successfully:', response);
          this.folderForm.reset();
          this.tags = [];
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création du dossier';
        }
      });
    } else {
      this.errorMessage = 'User ID is missing.';
    }
  }
}

