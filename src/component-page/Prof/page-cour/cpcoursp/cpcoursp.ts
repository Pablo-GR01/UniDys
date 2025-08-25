import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Cours } from '../../../../model/cours';
import { CoursService } from '../../../../services/cours.service';
import { RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cpcoursp',
  standalone: true,
  templateUrl: './cpcoursp.html',
  styleUrls: ['./cpcoursp.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  providers: [CoursService]
})
export class CPCOURSP implements OnInit {
  cours: Cours[] = [];
  coursFiltres: Cours[] = [];
  recherche: string = '';
  niveauActif: string | null = null;
  coursSelectionne: Cours | null = null;
  popupVisible = false;
  popupEditionVisible = false;
  coursAModifier: Cours = {} as Cours;
  fichierPdfModifie: File | null = null;
  lienYoutubeModifie: string = '';
  pdfUrlSanitized: SafeResourceUrl | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  constructor(
    private coursService: CoursService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.coursService.getCours().subscribe({
      next: (data) => {
        console.log('Cours reçus :', data);
        this.cours = data;
        this.filtrerCours();
      },
      error: (err) => {
        console.error('Erreur de chargement :', err);
      }
    });
  }

  filtrerParNiveau(niveau: string) {
    this.niveauActif = niveau;
    this.filtrerCours();
  }

  reinitialiserFiltre() {
    this.niveauActif = null;
    this.recherche = '';
    this.filtrerCours();
  }

  filtrerCours() {
    const rechercheLower = this.recherche.toLowerCase();

    this.coursFiltres = this.cours.filter(c => {
      const parNiveau = this.niveauActif ? c.niveau === this.niveauActif : true;
      const parMatiere = this.recherche
        ? (c.matiere && c.matiere.toLowerCase().includes(rechercheLower))
        : true;
      return parNiveau && parMatiere;
    });

    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.coursFiltres.length / this.itemsPerPage);
  }

  getCoursPage(): Cours[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.coursFiltres.slice(startIndex, endIndex);
  }

  pageSuivante() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  pagePrecedente() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  ouvrirPopup(cours: Cours): void {
    this.coursSelectionne = cours;
    this.popupVisible = true;

    if (cours.fichierPdf) {
      const url = `http://localhost:3000/uploads/${encodeURIComponent(cours.fichierPdf)}`;
      this.pdfUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.pdfUrlSanitized = null;
    }
  }

  fermerPopup(): void {
    this.popupVisible = false;
    this.coursSelectionne = null;
    this.pdfUrlSanitized = null;
  }

  ouvrirLienYoutube(lien: string | null | undefined): void {
    if (lien) {
      window.open(lien, '_blank');
    } else {
      console.warn("Lien YouTube non disponible.");
    }
  }

  goToCoursDetail(id: string): void {
    this.router.navigate(['/coursdetail', id]);
  }

  telechargerFichier(nomFichier: string): void {
    const url = `http://localhost:3000/uploads/${encodeURIComponent(nomFichier)}`;
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = nomFichier;
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
  }

  getImageParMatiere(matiere: string): string {
    switch (matiere.toLowerCase()) {
      case 'maths':
        return 'assets/coursmaths.png';
      case 'français':
        return 'assets/coursfrançais.png';
      case 'histoire':
        return 'assets/courshistoire.png';
      case 'sciences':
        return 'assets/sciences.png';
      default:
        return 'assets/img/default.jpg';
    }
  }
}
