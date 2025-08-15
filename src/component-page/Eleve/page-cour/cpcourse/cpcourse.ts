import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

import { Cours } from '../../../../model/cours';
import { CoursApiService } from '../../../../services/coursService/CoursApi.Service';
import { CoursQcmService } from '../../../../services/coursService/CoursQcm.Service';

@Component({
  selector: 'app-cpcourse',
  standalone: true,
  templateUrl: './cpcourse.html',
  styleUrls: ['./cpcourse.css'],
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [CoursApiService, CoursQcmService]
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
    private coursApi: CoursApiService,
    private coursQcm: CoursQcmService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    this.coursApi.getCours().pipe(
      switchMap(coursList => {
        this.cours = coursList;

        if (!userId) {
          this.cours.forEach(c => c.qcmsFait = false);
          return of(this.cours);
        }

        // On crée un tableau d'observables pour vérifier les QCM
        const qcmChecks = this.cours.map(c => {
          if (c.qcms && c.qcms.length > 0) {
            return this.coursQcm.hasUserDoneQcm(c._id, userId).pipe(
              map(fait => {
                c.qcmsFait = fait;
                return c;
              }),
              catchError(() => {
                c.qcmsFait = false;
                return of(c);
              })
            );
          } else {
            c.qcmsFait = false;
            return of(c);
          }
        });

        return forkJoin(qcmChecks);
      })
    ).subscribe({
      next: () => {
        this.coursFiltres = [...this.cours]; // force la mise à jour du template
      },
      error: (err) => console.error('Erreur de chargement :', err)
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
