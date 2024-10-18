import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CardService } from '../Service/card.service';
import { FolderService } from '../Service/folder.service';
import { CommonModule } from '@angular/common';
import { AddFolderComponent } from '../add-folder/add-folder.component';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddFolderComponent, RouterOutlet],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  cardForm: FormGroup; // Formulaire pour ajouter une carte
  errorMessage: string | null = null; // Message d'erreur
  folders: any[] = []; // Liste des dossiers
  userId: string | null = null; // ID de l'utilisateur
  showAddFolder: boolean = false; // Indicateur pour afficher/masquer le composant d'ajout de dossier

  constructor(
    private cardService: CardService, // Service pour gérer les cartes
    private folderService: FolderService, // Service pour gérer les dossiers
    private router: Router, // Service de routage
    private formBuilder: FormBuilder // Service pour construire le formulaire
  ) {
    // Récupère l'utilisateur authentifié depuis le localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('authUser');
      this.userId = user ? JSON.parse(user).id : null;
    }
    // Initialise le formulaire avec des validateurs
    this.cardForm = this.formBuilder.group({
      question: ['', Validators.required],
      response: ['', [Validators.required]],
      userId: [this.userId, Validators.required],
      folderId: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Charge les dossiers lors de l'initialisation du composant
    this.loadFolders();
  }

  loadFolders() {
    // Charge les dossiers de l'utilisateur si l'ID de l'utilisateur est défini
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

  toggleAddFolder() {
    // Affiche ou masque le composant d'ajout de dossier
    this.showAddFolder = !this.showAddFolder;
  }

  onFolderAdded() {
    // Recharge les dossiers après l'ajout d'un nouveau dossier
    this.loadFolders();
  }

  onSubmit(): void {
    // Soumet le formulaire pour créer une nouvelle carte
    if (this.cardForm.valid) {
      const card = this.cardForm.value;
      card.userId = this.userId;
      card.folderId = this.cardForm.get('folderId')?.value;

      this.cardService.createCard(card).subscribe({
        next: (response) => {
          console.log('Card created:', response);
          this.router.navigate(['/some-path']); // Redirige vers une autre page après la création de la carte
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la création de la carte';
        }
      });
    }
  }
}