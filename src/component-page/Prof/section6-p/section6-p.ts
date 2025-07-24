import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Icon } from "../../../component/icon/icon";

import { HttpClient, HttpClientModule } from '@angular/common/http';  // <-- Ajout import HttpClient
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-section6-p',
  templateUrl: './section6-p.html',
  styleUrls: ['./section6-p.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, Icon,HttpClientModule],
})
export class Section6E {
  popupOuvert = false;

  prenom: string = '';
  nom: string = '';
  avisMessage: string = '';

  // Injecter HttpClient
  constructor(public userService: UserService, private http: HttpClient) {}

  ouvrirPopup() {
    this.popupOuvert = true;
  }

  fermerPopup() {
    this.popupOuvert = false;
    this.prenom = '';
    this.nom = '';
    this.avisMessage = '';
  }

  validerAvis() {
    if (!this.prenom.trim() || !this.nom.trim() || !this.avisMessage.trim()) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    const motsInterdits = ['con', 'merde', 'idiot', 'nul', 'putain'];

    const contientInsulte = motsInterdits.some((mot) =>
      this.avisMessage.toLowerCase().includes(mot)
    );

    if (contientInsulte) {
      alert("Ton message contient des mots inappropriés. Merci de reformuler.");
      return;
    }

    // Préparer les données à envoyer
    const avis = {
      prenom: this.prenom,
      nom: this.nom,
      message: this.avisMessage,
    };

    // Envoi HTTP POST à ton backend
    this.http.post('http://localhost:3000/api/avis', avis)
      .pipe(
        catchError(err => {
          alert('Erreur lors de l\'envoi de l\'avis.');
          console.error(err);
          return throwError(() => err);
        })
      )
      .subscribe((res: any) => {
        alert('Merci pour ton avis !');
        console.log('Réponse serveur:', res);
        this.fermerPopup();
      });
  }
}
