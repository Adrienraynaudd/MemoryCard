import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../interfaces/card';
import { CardService } from '../Service/card.service';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css'
})
export class AddCardComponent {
  cardForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private cardService: CardService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.cardForm = this.formBuilder.group({
      question: ['', Validators.required],
      response: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      const card: Card = this.cardForm.value;
      this.cardService.createCard(card).subscribe({
        next: (response) => {
          console.log('Carte créée avec succès', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création de la carte. Veuillez réessayer.';
          console.error('Erreur de création de carte', error);
        }
      });
    }
  }
}
