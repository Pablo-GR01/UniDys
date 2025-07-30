import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursRefreshService } from '../../../../services/cours-refresh.service'; // adapte le chemin


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




  ouvrirPopupCours() {
    this.popupCoursOuvert = true;
  }

  fermerPopupCours() {
    this.popupCoursOuvert = false;
    this.resetForm();
  }

  ouvrirPopupQCM() {
    this.popupQcmOuvert = true;
  }

  fermerPopupQCM() {
    this.popupQcmOuvert = false;
  }

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
    if (event.target.files && event.target.files.length > 0) {
      this.pdfFile = event.target.files[0];
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
      reponses: ['', ''],
      bonneReponse: 1 // par défaut la 1ère réponse bonne (valeur 1)
    });
  }

  ajouterReponse(index: number) {
    this.qcms[index].reponses.push('');
  }

  supprimerQCM(index: number) {
    this.qcms.splice(index, 1);
  }

  validerQCM() {
    if (this.qcms.length === 0) {
      alert('Vous devez ajouter au moins un QCM avant de valider.');
      return;
    }

    for (const qcm of this.qcms) {
      if (!qcm.question.trim()) {
        alert('Chaque QCM doit avoir une question.');
        return;
      }
      // tu peux aussi vérifier qu'il y a au moins 2 réponses non vides
      if (qcm.reponses.filter(r => r.trim() !== '').length < 2) {
        alert('Chaque QCM doit avoir au moins deux réponses non vides.');
        return;
      }
      // et vérifier que bonneReponse est valide
      if (qcm.bonneReponse < 1 || qcm.bonneReponse > qcm.reponses.length) {
        alert('Veuillez sélectionner une bonne réponse valide.');
        return;
      }
    }

    this.popupQcmOuvert = false;
    // Les qcms sont déjà modifiés dans le formulaire, rien à faire
  }

  validerCours() {
    if (!this.titreCours || !this.nomProf || !this.matiere || !this.niveau || !this.pdfFile) {
      alert('Veuillez remplir tous les champs obligatoires et sélectionner un PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.titreCours);
    formData.append('nomProf', this.nomProf);
    formData.append('niveau', this.niveau);
    formData.append('matiere', this.matiere);
    formData.append('lienYoutube', this.lienYoutube || '');
    formData.append('pdf', this.pdfFile);

    // Envoi des QCM sous forme JSON stringifiée uniquement s'il y en a
    const qcmUtiles = this.qcms.filter(q => q.question.trim() !== '');
    if (qcmUtiles.length > 0) {
      formData.append('qcms', JSON.stringify(qcmUtiles));
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
    this.http.get<any[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(this.nomProf)}`)
  }
}
