import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-footer-p',
  imports: [FormsModule,HttpClientModule],
  templateUrl: './footer-p.html',
  styleUrl: './footer-p.css'
})
export class FooterP {
  email = '';

  constructor(private http: HttpClient) {}

  enregistrerEmail() {
    const emailTrimmed = this.email.trim();
    if (emailTrimmed) {
      const payload = { email: emailTrimmed };

      // Remplace l'URL par celle de ton API backend
      this.http.post('https://ton-api-url/endpoint-newsletter', payload).subscribe({
        next: () => {
          alert(`Merci pour votre inscription : ${emailTrimmed}`);
          this.email = '';
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        }
      });
    } else {
      alert('Veuillez saisir une adresse email valide.');
    }
  }
}

