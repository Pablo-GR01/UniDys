import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Cours } from '../../../../model/cours';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CoursRefreshService } from '../../../../services/cours-refresh.service';

@Component({
  selector: 'app-mescours-p',
  templateUrl: './mescours-p.html',
  styleUrls: ['./mescours-p.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class MescoursP implements OnInit, OnDestroy {
  @ViewChild('track', { static: false }) track!: ElementRef<HTMLDivElement>;

  cours: Cours[] = [];
  coursSelectionne: Cours | null = null;
  popupVisible = false;
  popupEditionVisible = false;
  coursAModifier: Cours = {} as Cours;
  fichierPdfModifie: File | null = null;
  pdfUrlSanitized: SafeResourceUrl | null = null;
  lienYoutubeModifie: string = '';

  private refreshSub!: Subscription;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private refreshService: CoursRefreshService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerCoursProf();

    this.refreshSub = this.refreshService.refreshRequested$.subscribe(() => {
      this.chargerCoursProf();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  // ✅ Charge les cours du prof connecté
  chargerCoursProf(): void {
    const nomProf = localStorage.getItem('nomProf'); // Stocker "Javier Garcia" directement
    if (!nomProf) {
      console.warn('Nom du professeur manquant dans localStorage');
      this.cours = [];
      return;
    }

    this.http.get<Cours[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(nomProf)}`)
      .subscribe({
        next: (data) => {
          console.log('Cours reçus pour', nomProf, data);
          this.cours = data || [];
        },
        error: (err) => {
          console.error('Erreur lors du chargement des cours :', err);
          this.cours = [];
        },
      });
  }

  scroll(direction: number): void {
    if (!this.track?.nativeElement) return;
    const scrollAmount = 300;
    this.track.nativeElement.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
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

  ouvrirPopupEdition(cours: Cours): void {
    this.coursAModifier = { ...cours };
    this.popupEditionVisible = true;
    this.fichierPdfModifie = null;
    this.lienYoutubeModifie = cours.lienYoutube || '';
  }

  fermerPopupEdition(): void {
    this.popupEditionVisible = false;
    this.coursAModifier = {} as Cours;
    this.fichierPdfModifie = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) this.fichierPdfModifie = input.files[0];
  }

  validerModificationCours(): void {
    if (!this.coursAModifier?._id) return;
    const formData = new FormData();
    formData.append('titre', this.coursAModifier.titre);
    formData.append('lienYoutube', this.lienYoutubeModifie || '');
    if (this.fichierPdfModifie) formData.append('fichierPdf', this.fichierPdfModifie);

    this.http.put(`http://localhost:3000/api/cours/${this.coursAModifier._id}`, formData).subscribe({
      next: () => {
        alert('Cours modifié avec succès !');
        this.fermerPopupEdition();
        this.refreshService.demanderRafraichissement();
      },
      error: (err) => {
        console.error('Erreur lors de la modification du cours', err);
        alert('Erreur lors de la modification.');
      },
    });
  }

  supprimerCours(cours: Cours): void {
    if (!confirm(`Supprimer le cours "${cours.titre}" ?`)) return;
    this.http.delete(`http://localhost:3000/api/cours/${cours._id}`).subscribe({
      next: () => this.chargerCoursProf(),
      error: (err) => console.error('Erreur lors de la suppression du cours :', err),
    });
  }

  ouvrirLienYoutube(lien: string | null | undefined): void {
    if (lien) window.open(lien, '_blank');
  }

  goToCoursDetail(id: string): void {
    this.router.navigate(['/coursdetail', id]);
  }

  telechargerFichier(nomFichier: string): void {
    const url = `http://localhost:3000/uploads/${encodeURIComponent(nomFichier)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = nomFichier;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
}
