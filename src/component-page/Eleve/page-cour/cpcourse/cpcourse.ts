import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Cours } from '../../../../model/cours';
import { CoursService } from '../../../../services/cours.service';
import { RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-cpcourse',
  standalone: true,
  templateUrl: './cpcourse.html',
  styleUrls: ['./cpcourse.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  providers: [CoursService]
})
export class CPCOURSE implements OnInit {
  cours: Cours[] = [];
  coursFiltres: Cours[] = [];
  recherche: string = '';
  niveauActif: string | null = null;
  coursSelectionne: Cours | null = null;
  popupVisible = false;
  pdfUrlSanitized: SafeResourceUrl | null = null;

  constructor(
    private coursService: CoursService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId'); // id utilisateur connecté
  
    this.coursService.getCours().subscribe({
      next: (data) => {
        this.cours = data;
  
        if (!userId) {
          this.cours.forEach(c => c.qcmsFait = false);
          this.coursFiltres = [...this.cours];
          return;
        }
  
        // On récupère tous les états QCM avant de mettre à jour le template
        const qcmChecks = this.cours.map(cours => {
          if (cours.qcms && cours.qcms.length > 0) {
            return this.coursService.hasUserDoneQcm(cours._id, userId).toPromise().then(fait => {
              cours.qcmsFait = fait;
            });
          } else {
            cours.qcmsFait = false;
            return Promise.resolve();
          }
        });
  
        Promise.all(qcmChecks).then(() => {
          this.coursFiltres = [...this.cours]; // force la mise à jour du template
        });
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
  }

  ouvrirLienYoutube(lien: string | null | undefined): void {
    if (lien) window.open(lien, '_blank');
  }

  goToCoursDetail(id: string): void {
    this.router.navigate(['/coursdetailE', id]);
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
      case 'maths': return 'assets/coursmaths.png';
      case 'français': return 'assets/coursfrançais.png';
      case 'histoire': return 'assets/courshistoire.png';
      case 'sciences': return 'assets/sciences.png';
      default: return 'assets/img/default.jpg';
    }
  }

  isActive(niveau: string | null): boolean {
    return this.niveauActif === niveau;
  }
}
