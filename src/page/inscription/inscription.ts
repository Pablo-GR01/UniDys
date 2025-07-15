import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';  // Import Router
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Logo } from "../../../public/component/logo/logo";
import { Icon } from "../../../public/component/icon/icon";

interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  codeProf?: string;
  role: 'prof' | 'eleve';
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Logo, Icon], // Ajout HttpClientModule ici aussi
  templateUrl: './inscription.html',
})
export class inscription implements OnInit {
  constructor(private http: HttpClient, private router: Router) {} // Injection Router

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  actif: 'prof' | 'eleve' = 'eleve';
  readonly CODE_PROF = 'PROF2025';

  inscriptionData: InscriptionData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    codeProf: '',
    role: 'eleve',
  };

  activerProf(): void {
    this.actif = 'prof';
    this.inscriptionData.role = 'prof';
    this.router.navigate(['/page-prof']); // Navigation correcte
  }

  activerEleve(): void {
    this.actif = 'eleve';
    this.inscriptionData.role = 'eleve';
    this.inscriptionData.codeProf = '';
    this.router.navigate(['/page-eleve']); // Navigation correcte
  }

  formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeProf } = this.inscriptionData;
    if (!nom || !prenom || !email || !password) {
      return false;
    }
    if (role === 'prof' && codeProf !== this.CODE_PROF) {
      return false;
    }
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

  const payload = { ...this.inscriptionData };
  if (payload.role !== 'prof') {
    delete payload.codeProf;
  }

  this.http.post('http://localhost:3000/api/inscription', payload).subscribe({
    next: () => {
      alert('Compte créé avec succès !');
      this.inscriptionData = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        codeProf: '',
        role: this.actif,
      };

      // Redirection selon rôle
      if (payload.role === 'prof') {
        this.router.navigate(['/page-prof']);
      } else {
        this.router.navigate(['/page-eleve']);
      }
    },
    error: (error) => {
      if (error.status === 400) {
        alert('Cet email est déjà utilisé');
      } else {
        alert("Erreur lors de la création du compte.");
      }
    },
  });
}

}
