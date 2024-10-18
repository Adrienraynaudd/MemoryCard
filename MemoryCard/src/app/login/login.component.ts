import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../interfaces/user';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../Service/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup; // Formulaire de connexion
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private userService: UserService, // Service pour gérer les utilisateurs
    private router: Router, // Service de routage
    private formBuilder: FormBuilder, // Service pour construire le formulaire
    private authService: AuthService // Service pour gérer l'authentification
  ) {
    // Initialise le formulaire avec des validateurs
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    // Soumet le formulaire de connexion
    if (this.loginForm.valid) {
      const user: User = this.loginForm.value;
      this.userService.login(user).subscribe({
        next: async (response) => {
          if (response.token) {
            // Sauvegarde les données d'authentification et met à jour le token
            await this.userService.saveAuthData(response.token, response.user);
            this.userService.Token = response.token;
            this.authService.emitAuthStatus(true); // Émet le statut d'authentification
            this.router.navigate(['/home']); // Redirige vers la page d'accueil
          }
        },
        error: (error) => {
          // Gère les erreurs de connexion
          this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
          console.error('Erreur de connexion', error);
        }
      });
    }
  }
}