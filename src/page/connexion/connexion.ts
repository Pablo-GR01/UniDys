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
  // -------------------------
  // Variables d'état
  // -------------------------
  passwordVisible = false;
  isLoading = false;
  message: string | null = null;
  errorMessage: string | null = null;
  redirectionApresConnexion: string | null = null;

  // -------------------------
  // Données du formulaire
  // -------------------------
  connexionData = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // -------------------------
  // Toggle visibilité mot de passe
  // -------------------------
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // -------------------------
  // Vérifie que le formulaire est valide
  // -------------------------
  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    return !!email && !!password && password.length >= 6;
  }

  // -------------------------
  // Valide le formulaire et effectue la connexion
  // -------------------------
  valider(): void {
    if (!this.formulaireValide()) {
      alert('Veuillez remplir correctement le formulaire.');
      return;
    }

    this.isLoading = true;
    const { email, password } = this.connexionData;

    // -------------------------
    // Appel API pour authentification
    // -------------------------
    this.http.post('http://localhost:3000/api/unidys/login', { email, password }).subscribe({
      next: (user: any) => {
        // -------------------------
        // Création des initiales si manquantes
        // -------------------------
        if (!user.initiale && user.prenom && user.nom) {
          user.initiale =
            (user.prenom[0] ?? '').toUpperCase() +
            (user.nom[0] ?? '').toUpperCase();
        }

        // -------------------------
        // Stockage utilisateur global
        // -------------------------
        this.authService.setUser(user);

        // -------------------------
        // Stockage localStorage pour la session
        // -------------------------
        localStorage.setItem('user', JSON.stringify(user));

        // -------------------------
        // Mise à jour nomProf si rôle professeur
        // -------------------------
        if ((user.role || '').toLowerCase().includes('prof')) {
          const nomProf = `${user.prenom} ${user.nom}`;
          localStorage.setItem('nomProf', nomProf);
        }

        this.message = 'Bienvenue sur UniDys !';

        // -------------------------
        // Normalisation du rôle pour redirection
        // -------------------------
        const roleRaw = (user.role || '').toLowerCase();
        let roleKey: string;

        if (roleRaw.includes('admin')) {
          roleKey = 'admin';
        } else if (roleRaw.includes('prof')) {
          roleKey = 'prof';
        } else if (roleRaw.includes('eleve') || roleRaw.includes('étudiant')) {
          roleKey = 'eleve';
        } else {
          roleKey = 'eleve'; // fallback
        }

        const routeMap: { [key: string]: string } = {
          admin: '/accueilA',
          prof: '/accueilP',
          eleve: '/accueilE',
        };
        this.redirectionApresConnexion = routeMap[roleKey];

        // -------------------------
        // Redirection après délai pour afficher message
        // -------------------------
        setTimeout(() => {
          this.router.navigate([this.redirectionApresConnexion!]);
          this.message = null;
          this.redirectionApresConnexion = null;
          this.isLoading = false;
        }, 1200);
      },

      // -------------------------
      // Gestion des erreurs API
      // -------------------------
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur serveur';
        this.isLoading = false;
        console.error('Erreur de connexion :', err);
      },
    });
  }

  // -------------------------
  // Déconnexion : supprime localStorage et réinitialise profil
  // -------------------------
  deconnecter(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('nomProf'); // supprime le nomProf si connecté
    this.authService.clearUser();
    this.router.navigate(['/connexion']);
  }
}
