import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Logo } from '../../component/logo/logo';
import { Icon } from '../../component/icon/icon';
import { UserService } from '../../services/user.service';

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

  // ✅ Deux messages distincts
  message: string | null = null;


  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      this.router.navigate(['/accueilE']);
    }
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

  formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeProf } = this.inscriptionData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nom || !prenom) return false;
    if (!emailRegex.test(email)) return false;
    if (!password || password.length < 6) return false;
    if (role === 'prof' && codeProf !== this.CODE_PROF) return false;

    return true;
  }

  valider(): void {
    if (!this.formulaireValide()) {
      alert(
        this.inscriptionData.role === 'prof'
          ? 'Veuillez entrer un code professeur valide.'
          : 'Veuillez remplir tous les champs requis.'
      );
      return;
    }

    const initiale = (this.inscriptionData.prenom[0] ?? '').toUpperCase() +
                     (this.inscriptionData.nom[0] ?? '').toUpperCase();

    const payload = {
      ...this.inscriptionData,
      initiale,
    };

    if (payload.role !== 'prof') {
      delete payload.codeProf;
    }

    this.http.post('http://localhost:3000/api/unidys/users', payload).subscribe({
      next: (res: any) => {
        // ✅ Message personnalisé selon le rôle
        if (payload.role === 'prof') {
          this.message= `Bienvenue sur UniDys !`;
        } else if (payload.role === 'eleve') {
          this.message = `Bienvenue sur UniDys !`;
        }

        // ✅ Stocker l'utilisateur
        this.userService.setUser(res);

        // Réinitialiser le formulaire
        this.inscriptionData = {
          nom: '',
          prenom: '',
          email: '',
          password: '',
          codeProf: '',
          role: this.actif,
          initiale: '',
        };

        // ✅ Redirection selon le rôle
        const redirection =
          payload.role === 'prof' ? '/accueilP' :
          payload.role === 'admin' ? '/accueilA' :
          '/accueilE';

        // ✅ Attente avant redirection
        setTimeout(() => {
          this.router.navigate([redirection]);
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte', err);
        if (err.status === 400) {
          alert('Cet email est déjà utilisé.');
        } else {
          alert('Erreur lors de la création du compte.');
        }
      }
    });
  }
}
