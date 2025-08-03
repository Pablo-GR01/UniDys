import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursRefreshService } from '../../../../services/cours-refresh.service';

@Component({
  selector: 'app-section7-p',
  templateUrl: './section7-p.html',
  styleUrls: ['./section7-p.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Section7P {
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
  }[] = [];

  constructor(private http: HttpClient, private refreshService: CoursRefreshService) {}

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
    if (event.target.files.length > 0) this.pdfFile = event.target.files[0];
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
    this.qcms.push({ question: '', reponses: ['', ''], bonneReponse: 1 });
  }

  ajouterReponse(index: number) {
    this.qcms[index].reponses.push('');
  }

  supprimerQCM(index: number) {
    this.qcms.splice(index, 1);
  }

  validerQCM() {
    for (const qcm of this.qcms) {
      if (!qcm.question.trim()) return alert('Chaque QCM doit avoir une question.');
      if (qcm.reponses.filter(r => r.trim() !== '').length < 2) return alert('Min. 2 réponses requises.');
      if (qcm.bonneReponse < 1 || qcm.bonneReponse > qcm.reponses.length) return alert('Bonne réponse invalide.');
    }
    this.popupQcmOuvert = false;
  }

  validerCours() {
    if (!this.titreCours || !this.matiere || !this.niveau || !this.pdfFile) {
      alert('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    if (!utilisateur._id) return alert('Erreur : utilisateur non connecté.');

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
}
