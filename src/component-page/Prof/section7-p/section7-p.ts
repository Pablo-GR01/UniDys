import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section7-p',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './section7-p.html',
  styleUrls: ['./section7-p.css']
})
export class Section7P implements OnInit {
  utilisateurId = '';
  popupCoursOuvert = false;

  titreCours = '';
  lienYoutube = '';
  matiere = '';
  niveau = '';
  pdfFichier: File | null = null;

  imageMatiere: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.utilisateurId = localStorage.getItem('utilisateurId') || '';
  }

  ouvrirPopupCours() {
    this.popupCoursOuvert = true;
  }

  fermerPopupCours() {
    this.popupCoursOuvert = false;
  }

  onPdfSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfFichier = input.files[0];
    }
  }

  mettreAJourImage() {
    const images: { [key: string]: string } = {
      'Français': 'assets/coursfrançais.png',
      'Maths': 'assets/coursmaths.png',
      'Histoire': 'assets/courshistoire.png',
      'Sciences': 'assets/images/sciences.png',
    };
    this.imageMatiere = images[this.matiere] || null;
  }

  validerCours() {
    if (!this.titreCours || !this.pdfFichier || !this.matiere || !this.niveau) {
      alert("Merci de remplir tous les champs !");
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.titreCours);
    formData.append('pdf', this.pdfFichier);
    formData.append('matiere', this.matiere);
    formData.append('niveau', this.niveau);
    formData.append('utilisateurId', this.utilisateurId); // ✅ Ajout important

    if (this.lienYoutube) {
      formData.append('video', this.lienYoutube);
    }

    this.http.post('http://localhost:3000/api/cours', formData).subscribe({
      next: () => {
        alert("Cours ajouté !");
        this.fermerPopupCours();
        this.titreCours = '';
        this.lienYoutube = '';
        this.matiere = '';
        this.niveau = '';
        this.pdfFichier = null;
        this.imageMatiere = null;
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du cours:', err);
        alert("Erreur lors de l'ajout.");
      }
    });
  }
}
