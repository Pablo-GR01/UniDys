import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section7-p',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './section7-p.html',
  styleUrls: ['./section7-p.css']
})
export class Section7P {
  popupCoursOuvert: boolean = false;

  nomProf: string = '';
  titreCours: string = '';
  lienYoutube: string = '';
  matiere: string = '';
  niveau: string = '';
  pdfFichier: File | null = null;
  imageMatiere: string | null = null;

  constructor(private http: HttpClient) {
    // Récupérer automatiquement le nom du prof s'il est déjà stocké dans localStorage
    this.nomProf = localStorage.getItem('nomProf') || '';
  }

  ouvrirPopupCours(): void {
    this.popupCoursOuvert = true;
  }

  fermerPopupCours(): void {
    this.popupCoursOuvert = false;
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfFichier = input.files[0];
    }
  }

  mettreAJourImage(): void {
    const images: Record<string, string> = {
      'Français': 'assets/coursfrançais.png',
      'Maths': 'assets/coursmaths.png',
      'Histoire': 'assets/courshistoire.png',
      'Sciences': 'assets/images/sciences.png',
    };
    this.imageMatiere = images[this.matiere] || null;
  }

  validerCours(): void {
    // Vérifications basiques
    if (!this.titreCours.trim()) {
      alert("Titre du cours manquant");
      return;
    }
    if (!this.pdfFichier) {
      alert("PDF manquant");
      return;
    }
    if (!this.matiere.trim()) {
      alert("Matière manquante");
      return;
    }
    if (!this.niveau.trim()) {
      alert("Niveau manquant");
      return;
    }
    if (!this.nomProf.trim()) {
      alert("Nom du professeur manquant");
      return;
    }

    // Construction des données à envoyer
    const formData = new FormData();
    formData.append('titre', this.titreCours);
    formData.append('pdf', this.pdfFichier, this.pdfFichier.name);
    formData.append('matiere', this.matiere);
    formData.append('niveau', this.niveau);
    formData.append('nomProf', this.nomProf);
    if (this.lienYoutube.trim()) {
      formData.append('video', this.lienYoutube);
    }

    this.http.post('http://localhost:3000/api/cours', formData).subscribe({
      next: () => {
        alert(`Cours ajouté avec succès par : ${this.nomProf}`);
        this.fermerPopupCours();

        // Réinitialiser le formulaire
        this.titreCours = '';
        this.lienYoutube = '';
        this.matiere = '';
        this.niveau = '';
        this.pdfFichier = null;
        this.imageMatiere = null;
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du cours:", err);
        alert("Erreur lors de l'ajout du cours.");
      }
    });
  }
}
