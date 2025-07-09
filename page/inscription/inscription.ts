import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Ajouté pour [(ngModel)]
import { Logo } from "../../public/component/logo/logo";
import { Icon } from "../../public/component/icon/icon";

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
  imports: [CommonModule, RouterModule, FormsModule, Logo, Icon],
  templateUrl: './inscription.html',
})
export class inscription {
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
  }

  activerEleve(): void {
    this.actif = 'eleve';
    this.inscriptionData.role = 'eleve';
    this.inscriptionData.codeProf = '';
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

    const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');

    if (utilisateurs.find((u: any) => u.email === this.inscriptionData.email)) {
      alert('Cet email est déjà utilisé');
      return;
    }

    // Supprime codeProf si non prof
    const nouvelUtilisateur = { ...this.inscriptionData };
    if (nouvelUtilisateur.role !== 'prof') {
      delete nouvelUtilisateur.codeProf;
    }

    utilisateurs.push(nouvelUtilisateur);
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));

    alert('Compte créé avec succès !');

    // Réinitialisation du formulaire
    this.inscriptionData = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      codeProf: '',
      role: this.actif,
    };
  }
}
