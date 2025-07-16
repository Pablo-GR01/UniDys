import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Logo } from "../../../public/component/logo/logo";
import { Icon } from "../../../public/component/icon/icon";

interface ConnexionData {
  email: string;
  password: string;
  role: 'prof' | 'eleve';
  codeProf?: string;
}

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Logo, Icon],
  templateUrl: './connexion.html',
})
export class connexion implements OnInit {
  actif: 'prof' | 'eleve' = 'eleve';

  connexionData: ConnexionData = {
    email: '',
    password: '',
    role: 'eleve',
  };

  utilisateurConnecte?: { prenom?: string; email: string; role: string };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  activerProf(): void {
    this.actif = 'prof';
    this.connexionData.role = 'prof';
  }

  activerEleve(): void {
    this.actif = 'eleve';
    this.connexionData.role = 'eleve';
  }

  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    return !!email && !!password;
  }

  valider(): void {
    console.log('Données de connexion envoyées:', this.connexionData);

    if (!this.formulaireValide()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.http.post<{ prenom?: string, email: string, role: string }>(
      'http://localhost:3000/api/unidys/login',
      this.connexionData
    )
    .subscribe({
      next: (utilisateur) => {
        this.utilisateurConnecte = utilisateur; // Stocker les infos utilisateur
        alert(`Bienvenue ${utilisateur.prenom || utilisateur.email} !`);

        // Redirection selon rôle
        if (utilisateur.role === 'prof') {
          this.router.navigate(['/accueilP']);
        } else if (utilisateur.role === 'eleve') {
          this.router.navigate(['/accueilE']);
        } 
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        alert(err.error?.message || 'Email ou mot de passe incorrect.');
      }
    });
  }
}
