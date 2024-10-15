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
  imports: [ReactiveFormsModule,RouterOutlet, RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      school: [''],
      city: [''],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      this.userService.register(user).subscribe({
        next: (response) => {
          this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          this.errorMessage = null;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
          console.error('Erreur d\'inscription', error);
        }
      });
    }
  }
}
