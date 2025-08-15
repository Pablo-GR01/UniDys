import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Icon } from '../../component/icon/icon';
import { Logo } from '../../component/logo/logo';
import { UserSessionService } from '../../services/userService/user-session.service';
import { UserDataService, Utilisateur } from '../../services/userService/user-data.service';

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
    private userSession: UserSessionService,
    private userData: UserDataService
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

    this.userData.loginUser(email, password).subscribe(
      (user: Utilisateur) => {
        // Générer les initiales si manquantes
        if (!user.initiale && user.prenom && user.nom) {
          user.initiale = (user.prenom[0] ?? '').toUpperCase() + (user.nom[0] ?? '').toUpperCase();
        }

        // Stocker l'utilisateur dans la session
        this.userSession.login(user);

        this.message = `Bienvenue sur UniDys, ${user.prenom} !`;

        // Déterminer la redirection selon le rôle
        this.redirectionApresConnexion =
          user.role === 'admin' ? '/accueilA' :
          user.role === 'prof' ? '/accueilP' :
          '/accueilE';

        setTimeout(() => {
          this.router.navigate([this.redirectionApresConnexion!]);
          this.message = null;
          this.redirectionApresConnexion = null;
          this.isLoading = false;
        }, 1500);
      },
      (err) => {
        this.errorMessage = err.error?.message || 'Erreur serveur';
        this.isLoading = false;
        console.error('Erreur de connexion :', err);
      }
    );
  }
}
