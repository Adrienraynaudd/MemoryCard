import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../interfaces/user';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterOutlet,RouterLink,RouterLinkActive,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user: User = this.loginForm.value;
      this.userService.login(user).subscribe({
        next: (response) => {
          console.log('Connexion réussie', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
          console.error('Erreur de connexion', error);
        }
      });
    }
  }
}
