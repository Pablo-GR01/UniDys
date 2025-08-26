import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Logo } from '../../component/logo/logo';
import { Icon } from '../../component/icon/icon';
import { AuthService } from '../../services/userService/Auth.Service';

interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  codeProf?: string;
  role: 'prof' | 'eleve' | 'admin';
  initiale?: string;
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Logo, Icon, RouterLink],
  templateUrl: './inscription.html',
})
export class Inscription implements OnInit, OnDestroy {
  actif: 'prof' | 'eleve' = 'eleve';
  readonly CODE_PROF = 'PROF2025';

  inscriptionData: InscriptionData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    codeProf: '',
    role: 'eleve',
    initiale: '',
  };

  passwordVisible = false;
  formSubmitted = false;
  message: string | null = null;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  activerProf(): void {
    this.actif = 'prof';
    this.inscriptionData.role = 'prof';
  }

  activerEleve(): void {
    this.actif = 'eleve';
    this.inscriptionData.role = 'eleve';
    this.inscriptionData.codeProf = '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  isEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeProf } = this.inscriptionData;
    if (!nom || !prenom) return false;
    if (!this.isEmailValid(email)) return false;
    if (!password || password.length < 6) return false;
    if (role === 'prof' && codeProf !== this.CODE_PROF) return false;
    return true;
  }

  valider(): void {
    this.formSubmitted = true;

    if (!this.formulaireValide()) {
      return; // Erreurs affichées mais pas d’envoi
    }

    const initiale =
      (this.inscriptionData.prenom[0] ?? '').toUpperCase() +
      (this.inscriptionData.nom[0] ?? '').toUpperCase();

    const payload = { ...this.inscriptionData, initiale };
    if (payload.role !== 'prof') delete payload.codeProf;

    this.http.post('http://localhost:3000/api/unidys/users', payload).subscribe({
      next: (res: any) => {
        this.message = `Bienvenue sur UniDys !`;
        this.authService.setUser(res);

        const redirection =
          payload.role === 'prof' ? '/accueilP' :
          payload.role === 'admin' ? '/accueilA' :
          '/accueilE';

        setTimeout(() => this.router.navigate([redirection]), 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte', err);
        this.message = '⚠️ Erreur lors de la création du compte.';
      }
    });
  }
}
