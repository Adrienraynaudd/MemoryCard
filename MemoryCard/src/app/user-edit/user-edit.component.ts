import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../Service/user.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      city: ['', Validators.required],
      school: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const user = localStorage.getItem('authUser');
    var userId = user ? JSON.parse(user).id : null;
    if (userId && user !=null) {
          this.user = JSON.parse(user) as User;
          this.profileForm.patchValue({
            username: this.user.username,
            city: this.user.city,
            school: this.user.school
          });
      };
    }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedUser: User = {
        ...this.user, // Keep the current user's data (id, email, etc.)
        ...this.profileForm.value // Override with updated form values
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Profile updated successfully');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour du profil';
        }
      });
    }
  }

  getUserIdFromLocalStorage(): string | null {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user).id : null;
  }
}
