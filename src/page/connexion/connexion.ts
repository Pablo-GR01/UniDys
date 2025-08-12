import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from '../../component/icon/icon';
import { Logo } from '../../component/logo/logo';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
    Icon,
    Logo
  ],
})
export class Connexion {
  passwordVisible = false;
  isLoading = false;

  message: string | null = null;
  redirectionApresConnexion: string | null = null;
  errorMessage: string | null = null;

  connexionData = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) { }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    return !!email && !!password && password.length >= 6;
  }

  valider(): void {
    if (!this.formulaireValide()) {
      alert('Veuillez remplir correctement le formulaire.');
      return;
    }

    this.isLoading = true;

    const { email, password } = this.connexionData;

    this.http.post('http://localhost:3000/api/unidys/login', { email, password }).subscribe(
      (user: any) => {
        if (!user.initiale && user.prenom && user.nom) {
          user.initiale = (user.prenom[0] ?? '').toUpperCase() + (user.nom[0] ?? '').toUpperCase();
        }

        // On stocke l'utilisateur dans le service
        this.userService.setUser(user);

        // On enregistre en localStorage
        localStorage.setItem('prenom', user.prenom);
        localStorage.setItem('nom', user.nom);
        localStorage.setItem('email', user.email);

        // ➕ Stockage des XP (si fournis par le backend, sinon 0)
        localStorage.setItem('xp', user.xp?.toString() ?? '0');

        this.message = 'Bienvenue sur UniDys !';

        // Redirection selon le rôle reçu du backend
        if (user.role === 'admin') {
          this.redirectionApresConnexion = '/accueilA';
        } else if (user.role === 'prof') {
          this.redirectionApresConnexion = '/accueilP';
        } else {
          this.redirectionApresConnexion = '/accueilE';
        }

        setTimeout(() => {
          this.router.navigate([this.redirectionApresConnexion!]);
          this.message = null;
          this.redirectionApresConnexion = null;
          this.isLoading = false;
        }, 1500);
      },
      (err) => {
        this.errorMessage = err.error.message || 'Erreur serveur';
        this.isLoading = false;
        console.error('Erreur de connexion :', err);
      }
    );
  }
}
