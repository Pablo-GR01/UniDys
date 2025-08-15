import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from '../../component/icon/icon';
import { Logo } from '../../component/logo/logo';
import { AuthService } from '../../services/userService/Auth.Service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, Icon, Logo],
})
export class Connexion {
  passwordVisible = false;
  isLoading = false;

  message: string | null = null;
  errorMessage: string | null = null;
  redirectionApresConnexion: string | null = null;

  connexionData = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
  
    this.http.post('http://localhost:3000/api/unidys/login', { email, password }).subscribe({
      next: (user: any) => {
        // Ajouter initiales si manquantes
        if (!user.initiale && user.prenom && user.nom) {
          user.initiale =
            (user.prenom[0] ?? '').toUpperCase() +
            (user.nom[0] ?? '').toUpperCase();
        }
  
        // Stocker l'utilisateur
        this.authService.setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
  
        this.message = 'Bienvenue sur UniDys !';
  
        // Déterminer la route de redirection avec fallback sûr
        const routeMap: { [key: string]: string } = {
          admin: '/accueilA',
          prof: '/accueilP',
          eleve: '/accueilE'
        };
        const role = user.role?.toLowerCase() || 'eleve';
        this.redirectionApresConnexion = routeMap[role] || '/accueilE';
  
        // Redirection après délai
        setTimeout(() => {
          const route = this.redirectionApresConnexion ?? '/accueilE';
          this.router.navigate([route]);
          this.message = null;
          this.redirectionApresConnexion = null;
          this.isLoading = false;
        }, 1200);
        
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur serveur';
        this.isLoading = false;
        console.error('Erreur de connexion :', err);
      }
    });
  }
  
}
