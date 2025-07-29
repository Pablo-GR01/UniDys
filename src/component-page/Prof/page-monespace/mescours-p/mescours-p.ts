import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Cours {
  _id: string;
  titre: string;
  matiere: string;
  niveau: string;
  fichierPdf?: string;
  nomProf: string;
}

@Component({
  selector: 'app-mescours-p',
  templateUrl: './mescours-p.html',
  styleUrls: ['./mescours-p.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class MescoursP implements OnInit {
  cours: Cours[] = [];
  coursSelectionne: Cours | null = null;
  popupVisible = false;
  pdfUrlSanitized: SafeResourceUrl | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

 ngOnInit(): void {
  this.chargerCoursProf();
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
      },
    });
}


  ouvrirPopup(cours: Cours): void {
    this.coursSelectionne = cours;
    this.popupVisible = true;

    if (cours.fichierPdf) {
      const url = `http://localhost:3000/uploads/${cours.fichierPdf}`;
      this.pdfUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  fermerPopup(): void {
    this.popupVisible = false;
    this.coursSelectionne = null;
    this.pdfUrlSanitized = null;
  }

  getImageParMatiere(matiere: string): string {
    switch (matiere.toLowerCase()) {
      case 'maths': return 'assets/coursmaths.png';
      case 'français': return 'assets/coursfrançais.png';
      case 'histoire': return 'assets/courshitoire.png';
      default: return 'assets/img/default.jpg';
    }
  }

  // Fait défiler d’une carte à la fois
scroll(track: HTMLElement, dir: number) {
  const card = track.querySelector<HTMLElement>('.course-card');
  const step = card ? card.offsetWidth + 24 /* gap-6 */ : 360;
  track.scrollBy({ left: dir * step, behavior: 'smooth' });
}

}
