import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // nécessaire pour *ngIf
import { RouterModule } from '@angular/router';
import { Logo } from "../../public/component/logo/logo"; // pour routerLink

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, RouterModule, Logo],
  templateUrl: './inscription.html',
})

export class inscription {
  actif: 'prof' | 'eleve' = 'eleve';

  inscriptionData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    codeProf: '',
    role: 'eleve',
  };

  activerProf() {
    this.actif = 'prof';
    this.inscriptionData.role = 'prof';
  }

  activerEleve() {
    this.actif = 'eleve';
    this.inscriptionData.role = 'eleve';
  }

  valider() {
    // Récupérer la liste des utilisateurs existants dans localStorage
    const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');

    // Vérification email unique
    if (utilisateurs.find((u: any) => u.email === this.inscriptionData.email)) {
      alert('Cet email est déjà utilisé');
      return;
    }

    // Ajouter le nouvel utilisateur
    utilisateurs.push(this.inscriptionData);
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));

    alert('Compte créé avec succès !');

    // Optionnel : redirection ou reset du formulaire
  }
}
