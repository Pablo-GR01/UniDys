import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Icon } from "../../../component/icon/icon";

@Component({
  selector: 'app-section5-e',
  templateUrl: './section5-e.html',
  styleUrls: ['./section5-e.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
})
export class Section5E {
  // Pour gérer l'affichage de la pop-up
  popupOuvert = false;

  // Champs du formulaire
  prenom: string = '';
  nom: string = '';
  avisMessage: string = '';

  constructor(public userService: UserService) {}

  // Ouvre la pop-up
  ouvrirPopup() {
    this.popupOuvert = true;
  }

  // Ferme la pop-up et réinitialise
  fermerPopup() {
    this.popupOuvert = false;
    this.prenom = '';
    this.nom = '';
    this.avisMessage = '';
  }

  // Valide l'avis avec filtre d'insultes
  validerAvis() {
    if (!this.prenom.trim() || !this.nom.trim() || !this.avisMessage.trim()) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    const motsInterdits = ['con', 'merde', 'idiot', 'nul', 'putain']; // à compléter selon ton contexte

    const contientInsulte = motsInterdits.some((mot) =>
      this.avisMessage.toLowerCase().includes(mot)
    );

    if (contientInsulte) {
      alert("Ton message contient des mots inappropriés. Merci de reformuler.");
      return;
    }

    // ✅ Si tout est bon
    console.log('✅ Avis ajouté :', {
      prenom: this.prenom,
      nom: this.nom,
      message: this.avisMessage,
    });

    this.fermerPopup();
  }
}