import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section7-p',
  templateUrl: './section7-p.html',
  styleUrls: ['./section7-p.css'], // optionnel
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Section7P {
  popupCoursOuvert = false;

  titreCours = '';
  nomProf = '';
  niveau = '';
  matiere = '';
  lienYoutube = '';
  imageMatiere = '';
  pdfFile!: File;

  // QCMs vides par défaut (pas obligatoire)
  qcms: {
    question: string;
    reponses: string[];
    bonneReponse: number;
  }[] = [];

  constructor(private http: HttpClient) {}

  ouvrirPopupCours() {
    this.popupCoursOuvert = true;
  }

  fermerPopupCours() {
    this.popupCoursOuvert = false;
    this.titreCours = '';
    this.nomProf = '';
    this.niveau = '';
    this.matiere = '';
    this.lienYoutube = '';
    this.imageMatiere = '';
    this.qcms = [];
  }

  onPdfSelected(event: any) {
    this.pdfFile = event.target.files[0];
  }

  mettreAJourImage() {
    const images: any = {
      'Français': 'assets/francais.png',
      'Maths': 'assets/maths.png',
      'Histoire': 'assets/histoire.png',
      'Sciences': 'assets/sciences.png'
    };
    this.imageMatiere = images[this.matiere] || '';
  }

  ajouterQCM() {
    this.qcms.push({
      question: '',
      reponses: ['', ''],
      bonneReponse: 0
    });
  }

  ajouterReponse(index: number) {
    this.qcms[index].reponses.push('');
  }

  validerCours() {
    const formData = new FormData();
    formData.append('titre', this.titreCours);
    formData.append('nomProf', this.nomProf);
    formData.append('niveau', this.niveau);
    formData.append('matiere', this.matiere);
    formData.append('lienYoutube', this.lienYoutube || '');
    formData.append('pdf', this.pdfFile);

    // N’ajouter les QCMs que si au moins une question est remplie
    const qcmUtiles = this.qcms.filter(q => q.question.trim() !== '');
    if (qcmUtiles.length > 0) {
      formData.append('qcms', JSON.stringify(qcmUtiles));
    }

    this.http.post('http://localhost:3000/api/cours', formData).subscribe({
      next: () => {
        alert('Cours créé avec succès !');
        this.fermerPopupCours();
      },
      error: err => {
        console.error('Erreur lors de la création du cours', err);
        alert('Erreur lors de la création du cours.');
      }
    });
  }
}
