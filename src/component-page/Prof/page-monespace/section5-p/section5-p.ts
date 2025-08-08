import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CoursRefreshService } from '../../../../services/cours-refresh.service';
import { UserService } from '../../../../services/user.service';
import { Icon } from '../../../../component/icon/icon';

@Component({
  selector: 'app-section5-p',
  templateUrl: './section5-p.html',
  styleUrls: ['./section5-p.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Icon]
})
export class Section5P implements OnInit {
  // Erreur PDF
  messageErreurPdf = '';

  // Avis
  popupOuvert = false;
  prenom: string = '';
  nom: string = '';
  avisMessage: string = '';

  // Cours
  popupCoursOuvert = false;
  popupQcmOuvert = false;
  titreCours = '';
  nomProf = '';
  niveau = '';
  matiere = '';
  lienYoutube = '';
  imageMatiere = '';
  pdfFile!: File;

  qcms: {
    question: string;
    reponses: string[];
    bonneReponse: number;
    xp: number;
  }[] = [];

  constructor(
    public userService: UserService,
    private http: HttpClient,
    private refreshService: CoursRefreshService
  ) {}

  ngOnInit(): void {
    this.qcms = [
      {
        question: '',
        reponses: ['', ''], // Deux réponses par défaut
        bonneReponse: 0,
        xp: 10
      },
    ];
  }

  // ----- Gestion Avis -----
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

    const avis = {
      prenom: this.prenom,
      nom: this.nom,
      message: this.avisMessage,
    };

    this.http.post('http://localhost:3000/api/avis', avis)
      .pipe(
        catchError(err => {
          alert('Erreur lors de l\'envoi de l\'avis.');
          console.error(err);
          return throwError(() => err);
        })
      )
      .subscribe(() => {
        alert('Merci pour ton avis !');
        this.fermerPopup();
      });
  }

  // ----- Gestion Cours -----
  ouvrirPopupCours() { this.popupCoursOuvert = true; }
  fermerPopupCours() { this.popupCoursOuvert = false; this.resetForm(); }
  ouvrirPopupQCM() { this.popupQcmOuvert = true; }
  fermerPopupQCM() { this.popupQcmOuvert = false; }

  resetForm() {
    this.titreCours = '';
    this.nomProf = '';
    this.niveau = '';
    this.matiere = '';
    this.lienYoutube = '';
    this.imageMatiere = '';
    this.qcms = [];
    this.pdfFile = undefined!;
  }

  onPdfSelected(event: any) {
    const fichier = event.target.files[0];

    if (fichier) {
      if (fichier.type !== 'application/pdf') {
        this.messageErreurPdf = 'Seuls les fichiers PDF sont autorisés.';
        this.pdfFile = undefined!;
        event.target.value = ''; // Vide le champ de fichier
      } else {
        this.messageErreurPdf = '';
        this.pdfFile = fichier;
      }
    }
  }

  mettreAJourImage() {
    const images: any = {
      'Français': 'assets/coursfrançais.png',
      'Maths': 'assets/coursmaths.png',
      'Histoire': 'assets/courshistoire.png',
      'Sciences': 'assets/sciences.png'
    };
    this.imageMatiere = images[this.matiere] || '';
  }

  ajouterQCM() {
    this.qcms.push({
      question: '',
      reponses: [''],
      bonneReponse: 0,
      xp: 10 // valeur par défaut
    });
  }

  ajouterReponse(index: number) {
    this.qcms[index].reponses.push('');
  }

  supprimerQCM(index: number) {
    this.qcms.splice(index, 1);
  }

  validerQCM() {
    for (const qcm of this.qcms) {
      if (!qcm.question.trim()) {
        alert('Chaque QCM doit avoir une question.');
        return;
      }
      if (qcm.reponses.filter(r => r.trim() !== '').length < 2) {
        alert('Min. 2 réponses requises.');
        return;
      }
      if (qcm.bonneReponse < 0 || qcm.bonneReponse >= qcm.reponses.length) {
        alert('Bonne réponse invalide.');
        return;
      }
    }
    this.popupQcmOuvert = false;
  }

  validerCours() {
    if (!this.titreCours || !this.matiere || !this.niveau || !this.pdfFile) {
      alert('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    if (!utilisateur._id) {
      alert('Erreur : utilisateur non connecté.');
      return;
    }

    const formData = new FormData();
    formData.append('utilisateurId', utilisateur._id);
    formData.append('nomProf', utilisateur.nom);
    formData.append('titre', this.titreCours);
    formData.append('niveau', this.niveau);
    formData.append('matiere', this.matiere);
    formData.append('lienYoutube', this.lienYoutube || '');
    formData.append('pdf', this.pdfFile);

    if (this.qcms.length > 0) {
      formData.append('qcms', JSON.stringify(this.qcms));
    }

    this.http.post('http://localhost:3000/api/cours', formData).subscribe({
      next: () => {
        alert('Cours créé avec succès !');
        this.fermerPopupCours();
        this.fermerPopupQCM();
        this.refreshService.demanderRafraichissement();
      },
      error: err => {
        console.error('Erreur lors de la création du cours', err);
        alert('Erreur lors de la création du cours.');
      }
    });
  }

  incrementXp(qcm: any) {
    if (typeof qcm.xp !== 'number' || isNaN(qcm.xp)) {
      qcm.xp = 0;
    }
    qcm.xp++;
  }

  decrementXp(qcm: any) {
    if (typeof qcm.xp !== 'number' || isNaN(qcm.xp)) {
      qcm.xp = 0;
    }
    if (qcm.xp > 0) {
      qcm.xp--;
    }
  }

  validerXp(qcm: any, nouvelleValeur?: any) {
    let xpVal = typeof nouvelleValeur === 'number' ? nouvelleValeur : qcm.xp;
    if (typeof xpVal !== 'number' || isNaN(xpVal) || xpVal < 0) {
      qcm.xp = 0;
    } else {
      qcm.xp = Math.floor(xpVal);
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  supprimerReponse(indexQcm: number, indexReponse: number) {
    const reponses = this.qcms[indexQcm].reponses;
    if (reponses.length > 2) {  // Empêche la suppression si moins de 2 réponses restantes
      reponses.splice(indexReponse, 1);
    }
  }

  changerReponse(i: number, j: number, nouvelleValeur: string): void {
    this.qcms[i].reponses[j] = nouvelleValeur;
  }

  get xpTotal(): number {
    return this.qcms.reduce((total, qcm) => total + (qcm.xp || 0), 0);
  }

}
