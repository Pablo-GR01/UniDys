import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CoursRefreshService } from '../../../../services/cours-refresh.service'; // adapte le chemin
import { Cours } from '../../../../model/cours';

@Component({
  selector: 'app-mescours-p',
  templateUrl: './mescours-p.html',
  styleUrls: ['./mescours-p.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MescoursP implements OnInit, OnDestroy {
  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLDivElement>;

  cours: Cours[] = [];
  coursSelectionne: Cours | null = null;
  popupVisible = false;
  pdfUrlSanitized: SafeResourceUrl | null = null;

  private refreshSub!: Subscription;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private refreshService: CoursRefreshService
  ) {}

  ngOnInit(): void {
    this.chargerCoursProf();
    this.refreshSub = this.refreshService.refreshRequested$.subscribe(() => {
      this.chargerCoursProf();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  chargerCoursProf(): void {
    const nomProf = localStorage.getItem('nomProf');
    if (!nomProf) {
      console.warn('Nom du professeur non trouvé dans localStorage');
      this.cours = [];
      return;
    }

    this.http
      .get<Cours[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(nomProf)}`)
      .subscribe({
        next: (data) => {
          this.cours = data;
          if (data.length === 0) {
            console.warn('Aucun cours trouvé pour ce professeur');
          }
        },
        error: (err) => {
          console.error('Erreur lors du chargement des cours:', err);
          this.cours = [];
        }
      });
  }

  scroll(direction: number): void {
    const track = this.trackRef.nativeElement;
    const card = track.querySelector('.course-card') as HTMLElement | null;
    if (!card) return;

    const cardWidth = card.offsetWidth + 16; // 16px = gap-6
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.scroll(-1);
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.scroll(1);
      event.preventDefault();
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

  getImageParMatiere(matiere: string): string {
    switch (matiere.toLowerCase()) {
      case 'maths':
        return 'assets/coursmaths.png';
      case 'français':
        return 'assets/coursfrançais.png';
      case 'histoire':
        return 'assets/courshistoire.png';
      default:
        return 'assets/img/default.jpg';
    }
  }
}
