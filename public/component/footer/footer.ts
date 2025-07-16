import { Component } from '@angular/core';
import { Icon } from '../icon/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, Icon],

  templateUrl: './footer.html',
  styleUrls: ['./footer.css'] // ✅ corrigé ici (styleUrl ➜ styleUrls)
})
export class Footer {
  emailNewsletter: string = '';

  inscrireNewsletter() {
  if (!this.emailNewsletter || !this.emailNewsletter.includes('@')) {
    alert("Merci de saisir une adresse email valide.");
    return;
  }

  // Appel backend pour enregistrer dans MongoDB
  this.http.post('http://localhost:3000/api/newsletter', {
    email: this.emailNewsletter,
    newsletter: 'Oui'
  }).subscribe({
    next: () => {
      alert("Merci ! Vous êtes inscrit à la newsletter.");
      this.emailNewsletter = '';
    },
    error: (err) => {
      console.error("Erreur inscription newsletter :", err);
      alert("Une erreur est survenue.");
    }
  });
}

}
