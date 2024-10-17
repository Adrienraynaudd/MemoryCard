import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../Service/user.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class UserEditComponent implements OnInit {
  user: User = {
    id: '',
    username: '',
    city: '',
    school: '',
    email: '',
    password: ''
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserDataFromLocalStorage(); // Récupérer les données de l'utilisateur depuis localStorage
  }

  loadUserDataFromLocalStorage() {
    const userData = localStorage.getItem('authUser'); // Récupérer les données stockées
    if (userData) {
      this.user = JSON.parse(userData); // Les assigner à l'objet `user`
    } else {
      console.error('Aucun utilisateur trouvé dans le localStorage');
    }
  }

  onSubmit() {
    if (this.user.id) {
      this.userService.updateUser(this.user).subscribe(
        response => {
          console.log('Profil mis à jour avec succès', response);
        },
        error => {
          console.error('Erreur lors de la mise à jour du profil', error);
        }
      );
    } else {
      console.error("L'ID de l'utilisateur est manquant.");
    }
  }
}
