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
  actif: 'prof' | 'eleve' = 'eleve';
  passwordVisible = false;

  // ✅ Deux messages distincts
  messageProf: string | null = null;
  messageEleve: string | null = null;
  messageAdmin: string | null = null;

  redirectionApresConnexion: string | null = null;
  errorMessage: string | null = null;

  connexionData = {
    email: '',
    password: '',
    codeProf: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) { }

  activerProf(): void {
    this.actif = 'prof';
  }

  activerEleve(): void {
    this.actif = 'eleve';
    this.connexionData.codeProf = '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  formulaireValide(): boolean {
    const { email, password, codeProf } = this.connexionData;
    if (!email || !password || password.length < 6) return false;
    if (this.actif === 'prof' && !codeProf) return false;
    return true;
  }

  valider(): void {
    if (!this.formulaireValide()) {
      alert('Veuillez remplir correctement le formulaire.');
      return;
    }

    const { email, password } = this.connexionData;

    this.http.post('http://localhost:3000/api/unidys/login', { email, password }).subscribe(
      (user: any) => {
        if (!user.initiale && user.prenom && user.nom) {
          user.initiale = (user.prenom[0] ?? '').toUpperCase() + (user.nom[0] ?? '').toUpperCase();
        }

        this.userService.setUser(user);

        // ✅ Stocker l’email dans localStorage
        localStorage.setItem('email', user.email);

        // ✅ Stocker le nom complet du prof si actif === prof
        if (this.actif === 'prof' && user.nom && user.prenom) {
          const nomComplet = `${user.prenom} ${user.nom}`.trim();
          localStorage.setItem('nomProf', nomComplet);
        }

        // ✅ Message personnalisé selon le rôle
        if (this.actif === 'prof') {
          this.messageProf = 'Bienvenue sur UniDys !';
        } else if (this.actif === 'eleve') {
          this.messageEleve = 'Bienvenue sur UniDys !';
        }else if (user.role === 'admin') {
          this.messageAdmin = 'Bienvenue sur UniDys !';
        }


        // ✅ Déterminer la redirection
        if (user.role === 'admin') {
          this.redirectionApresConnexion = '/accueilA';
        } else if (user.role === 'prof') {
          this.redirectionApresConnexion = '/accueilP';
        } else {
          this.redirectionApresConnexion = '/accueilE';
        }

        // ⏳ Attente avant redirection
        setTimeout(() => {
          this.router.navigate([this.redirectionApresConnexion!]);
          this.messageProf = null;
          this.messageEleve = null;
          this.redirectionApresConnexion = null;
        }, 1500);
      },
      (err) => {
        this.errorMessage = err.error.message || 'Erreur serveur';
        console.error('Erreur de connexion :', err);
      }
    );
  }

  confirmerRedirection(): void {
    if (this.redirectionApresConnexion) {
      this.router.navigate([this.redirectionApresConnexion]);
      this.messageProf = null;
      this.messageEleve = null;
      this.redirectionApresConnexion = null;
    }
  }
}
