import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Logo } from '../../component/logo/logo';
import { Icon } from '../../component/icon/icon';

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
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Logo, Icon],
  templateUrl: './inscription.html',
})
export class inscription implements OnInit {
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

  messageBienvenue: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log("ngOnInit called");
    document.body.style.overflow = 'hidden';
  
    // Gestion du token dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
  
    if (token) {
      localStorage.setItem('token', token);
      this.router.navigate(['/accueilE']); // adapter selon le rôle
    }
  }
  

  ngOnDestroy() {
    console.log("ngOnDestroy called");
    document.body.style.overflow = 'auto';
  }

  activerProf(): void {
    console.log("Activation profil prof");
    this.actif = 'prof';
    this.inscriptionData.role = 'prof';
  }

  activerEleve(): void {
    console.log("Activation profil eleve");
    this.actif = 'eleve';
    this.inscriptionData.role = 'eleve';
    this.inscriptionData.codeProf = '';
  }

  formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeProf } = this.inscriptionData;
    console.log("Validation formulaire:", { nom, prenom, email, password, role, codeProf });
    if (!nom || !prenom || !email || !password) {
      console.log("Formulaire invalide: champs manquants");
      return false;
    }
    if (role === 'prof' && codeProf !== this.CODE_PROF) {
      console.log("Formulaire invalide: code prof incorrect");
      return false;
    }
    return true;
  }

  valider(): void {
    console.log("Début de la validation");

    if (!this.formulaireValide()) {
      alert(
        this.inscriptionData.role === 'prof'
          ? 'Veuillez entrer un code professeur valide.'
          : 'Veuillez remplir tous les champs requis.'
      );
      console.log("Formulaire non valide, arrêt de la soumission");
      return;
    }

    // Calcul automatique de l'initiale
    const initiale = (this.inscriptionData.prenom?.[0] ?? '').toUpperCase() +
                     (this.inscriptionData.nom?.[0] ?? '').toUpperCase();

    const payload = {
      ...this.inscriptionData,
      initiale,
    };

    if (payload.role !== 'prof') {
      delete payload.codeProf;
    }

    console.log('Données envoyées au serveur:', payload);

    this.http.post('http://localhost:3000/api/unidys/users', payload).subscribe({
      next: (res) => {
        console.log('Réponse serveur reçue:', res);
        this.messageBienvenue = `Bienvenue sur UniDys, ${this.inscriptionData.prenom} !`;

        this.inscriptionData = {
          nom: '',
          prenom: '',
          email: '',
          password: '',
          codeProf: '',
          role: this.actif,
          initiale: '',
        };

        const redirection = 
        payload.role === 'prof' ? '/accueilP' :
        payload.role === 'admin' ? '/accueilA' :
        '/accueilE';


        setTimeout(() => {
          this.router.navigate([redirection]);
        }, 500);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte', err);
        if (err.status === 400) {
          alert('Cet email est déjà utilisé');
        } else {
          alert('Erreur lors de la création du compte.');
        }
      },
    });
  }

 
}
