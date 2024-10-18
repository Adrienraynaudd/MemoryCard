import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../interfaces/user';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup; // Formulaire d'inscription
  errorMessage: string | null = null; // Message d'erreur
  successMessage: string | null = null; // Message de succès

  constructor(
    private userService: UserService, // Service pour gérer les utilisateurs
    private router: Router, // Service de routage
    private formBuilder: FormBuilder // Service pour construire le formulaire
  ) {
    // Initialise le formulaire avec des validateurs
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      school: [''],
      city: [''],
    });
  }

  onSubmit() {
    // Soumet le formulaire d'inscription
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      this.userService.register(user).subscribe({
        next: (response) => {
          // Affiche un message de succès et redirige vers la page de connexion
          this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          this.errorMessage = null;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          // Affiche un message d'erreur en cas d'échec de l'inscription
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
          console.error('Erreur d\'inscription', error);
        }
      });
    }
  }
}