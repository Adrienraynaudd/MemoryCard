import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../Service/user.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  profileForm: FormGroup; // Formulaire de profil
  user: User | null = null; // Utilisateur actuel
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private fb: FormBuilder, // Service pour construire le formulaire
    private userService: UserService, // Service pour gérer les utilisateurs
    private router: Router // Service de routage
  ) {
    // Initialise le formulaire avec des validateurs
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      city: [''],
      school: ['']
    });
  }

  ngOnInit(): void {
    // Charge le profil de l'utilisateur lors de l'initialisation du composant
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Charge le profil de l'utilisateur depuis le localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem('authUser');
      var userId = user ? JSON.parse(user).id : null;
      if (userId && user != null) {
        this.user = JSON.parse(user) as User;
        console.log('User:', this.user);
        // Met à jour le formulaire avec les données de l'utilisateur
        this.profileForm.patchValue({
          username: this.user.username,
          city: this.user.city,
          school: this.user.school
        });
      }
    }
  }

  onSubmit(): void {
    // Soumet le formulaire de profil
    if (this.profileForm.valid) {
      console.log('Profile form is valid');
      const updatedUser: User = {
        ...this.user, // Conserve les données actuelles de l'utilisateur (id, email, etc.)
        ...this.profileForm.value // Remplace par les valeurs mises à jour du formulaire
      };
      console.log('Updated user:', updatedUser);
      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Profile updated successfully');
          if (typeof window !== 'undefined' && window.localStorage) {
            // Met à jour le localStorage avec les nouvelles données de l'utilisateur
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
            this.router.navigate(['/home']); // Redirige vers la page d'accueil
          }
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour du profil'; // Affiche un message d'erreur en cas d'échec
        }
      });
    }
  }

  getUserIdFromLocalStorage(): string | null {
    // Récupère l'ID de l'utilisateur depuis le localStorage
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user).id : null;
  }
}