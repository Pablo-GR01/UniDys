import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // nécessaire pour *ngIf
import { RouterModule } from '@angular/router';
import { Logo } from "../../public/component/logo/logo"; // pour routerLink
import { Icon } from "../../public/component/icon/icon"

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, RouterModule, Logo, Icon],
  templateUrl: './connexion.html',
})
export class connexion{
  actif: 'prof' | 'eleve' = 'eleve';

  activerProf() {
    this.actif = 'prof';
  }

  activerEleve() {
    this.actif = 'eleve';
  }

  valider() {
    console.log('Validation en tant que:', this.actif);
    // Ici, tu peux ajouter la logique pour traiter le formulaire (ex: envoi API)
  }
}
