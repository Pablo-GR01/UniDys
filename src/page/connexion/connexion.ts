import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Logo } from "../../../public/component/logo/logo";
import { Icon } from "../../../public/component/icon/icon";

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Logo, Icon],
  templateUrl: './connexion.html',
})
export class connexion implements OnInit {
  actif: 'prof' | 'eleve' = 'eleve';

  connexionData = {
    email: '',
    password: '',
    role: 'eleve',
  };

  constructor(private router: Router) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto'; // Remet le scroll quand on quitte la page
  }

  activerProf() {
    this.actif = 'prof';
    this.connexionData.role = 'prof';
    // Active le bouton si les champs sont remplis et redirige
    if (this.formulaireValide()) {
      this.router.navigate(['/page-prof']); // Page différente pour prof
    }
  }

  activerEleve() {
    this.actif = 'eleve';
    this.connexionData.role = 'eleve';
    if (this.formulaireValide()) {
      this.router.navigate(['/page-eleve']); // Page différente pour élève
    }
  }

  formulaireValide(): boolean {
    const data = this.connexionData;
    return !!(data.email && data.password);
  }

  valider() {
    if (!this.formulaireValide()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
    const utilisateur = utilisateurs.find(
      (u: any) =>
        u.email === this.connexionData.email &&
        u.password === this.connexionData.password &&
        u.role === this.connexionData.role
    );

    if (!utilisateur) {
      alert('Identifiants incorrects ou rôle non correspondant.');
      return;
    }

    alert(`Bienvenue ${utilisateur.prenom || utilisateur.email} !`);

    // Redirection vers la page d'accueil
    this.router.navigate(['/accueil']);
  }
}
