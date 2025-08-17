import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CoursRefreshService } from '../../../../services/cours-refresh.service';
import { Icon } from '../../../../component/icon/icon';
import { ProfileService } from '../../../../services/userService/Profile.Service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Cours {
  _id: string;
  titre: string;
  niveau: string;
  matiere: string;
  nomProf: string;
  lienYoutube?: string;
  fichierPdf?: string;
  qcms?: Qcm[];
}

interface Qcm {
  question: string;
  reponses: string[];
  bonneReponse: number;
  xp: number;
}

@Component({
  selector: 'app-section5-p',
  templateUrl: './section5-p.html',
  styleUrls: ['./section5-p.css'],
  standalone: true,
  imports: [Icon,FormsModule,CommonModule]
})
export class Section5P implements OnInit, OnDestroy {
  cours: Cours[] = [];
  popupCoursOuvert = false;
  popupQcmOuvert = false;
  popupOuvert = false;
  coursSelectionne: Cours | null = null;
  fichierPdf?: File;
  messageErreurPdf = '';
  titreCours = '';
  niveau = '';
  matiere = '';
  lienYoutube = '';
  imageMatiere = '';
  qcms: Qcm[] = [];
  prenom = '';
  nom = '';
  avisMessage = '';
  nomProf = '';

  private refreshSub!: Subscription;

  constructor(
    private http: HttpClient,
    private refreshService: CoursRefreshService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    if (!utilisateur.prenom || !utilisateur.nom) {
      console.error('Utilisateur non connecté');
      return;
    }
    this.nomProf = `${utilisateur.prenom} ${utilisateur.nom}`.trim();
    this.chargerCours();

    this.refreshSub = this.refreshService.refreshRequested$.subscribe(() => this.chargerCours());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  chargerCours(): void {
    this.http.get<Cours[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(this.nomProf)}`)
      .subscribe({
        next: data => this.cours = data || [],
        error: err => { console.error('Erreur chargement cours:', err); this.cours = []; }
      });
  }

  ouvrirPopupCours(cours?: Cours) {
    if (cours) {
      this.coursSelectionne = { ...cours };
      this.titreCours = cours.titre;
      this.niveau = cours.niveau;
      this.matiere = cours.matiere;
      this.lienYoutube = cours.lienYoutube || '';
      this.imageMatiere = this.getImageParMatiere(cours.matiere);
      this.qcms = cours.qcms || [];
    }
    this.popupCoursOuvert = true;
  }

  fermerPopupCours() {
    this.popupCoursOuvert = false;
    this.resetForm();
  }

  resetForm() {
    this.titreCours = '';
    this.niveau = '';
    this.matiere = '';
    this.lienYoutube = '';
    this.imageMatiere = '';
    this.fichierPdf = undefined;
    this.qcms = [];
    this.coursSelectionne = null;
  }

  onPdfSelected(event: any) {
    const fichier = event.target.files[0];
    if (fichier?.type === 'application/pdf') {
      this.fichierPdf = fichier;
      this.messageErreurPdf = '';
    } else {
      this.messageErreurPdf = 'Seuls les fichiers PDF sont autorisés.';
      this.fichierPdf = undefined;
      event.target.value = '';
    }
  }

  validerCours() {
    if (!this.titreCours || !this.niveau || !this.matiere || !this.fichierPdf) {
      alert('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    if (!utilisateur._id) { alert('Utilisateur non connecté'); return; }

    const formData = new FormData();
    formData.append('utilisateurId', utilisateur._id);
    formData.append('nomProf', this.nomProf);
    formData.append('titre', this.titreCours);
    formData.append('niveau', this.niveau);
    formData.append('matiere', this.matiere);
    formData.append('lienYoutube', this.lienYoutube || '');
    formData.append('pdf', this.fichierPdf);
    if (this.qcms.length > 0) formData.append('qcms', JSON.stringify(this.qcms));

    this.http.post('http://localhost:3000/api/cours', formData).subscribe({
      next: () => { 
        alert('Cours créé avec succès !'); 
        this.fermerPopupCours(); 
        this.refreshService.demanderRafraichissement(); 
      },
      error: err => { 
        console.error('Erreur création cours', err); 
        alert('Erreur lors de la création du cours.'); 
      }
    });
  }

  supprimerCours(cours: Cours) {
    if (!confirm(`Supprimer le cours "${cours.titre}" ?`)) return;
    this.http.delete(`http://localhost:3000/api/cours/${cours._id}`)
      .subscribe({ next: () => this.chargerCours(), error: err => console.error(err) });
  }

  getImageParMatiere(matiere: string): string {
    const images: Record<string, string> = { 
      'Français':'assets/coursfrançais.png',
      'Maths':'assets/coursmaths.png',
      'Histoire':'assets/courshistoire.png',
      'Sciences':'assets/sciences.png' 
    };
    return images[matiere] || 'assets/img/default.jpg';
  }

  ouvrirPopupQCM() { this.popupQcmOuvert = true; }
  fermerPopupQCM() { this.popupQcmOuvert = false; }

  ajouterQCM() { this.qcms.push({ question: '', reponses: ['',''], bonneReponse: 0, xp: 0 }); }
  supprimerQCM(index: number) { this.qcms.splice(index,1); }
  ajouterReponse(qcmIndex: number) { this.qcms[qcmIndex].reponses.push(''); }
  supprimerReponse(qcmIndex: number, repIndex: number) { this.qcms[qcmIndex].reponses.splice(repIndex,1); }
  incrementXp(qcm: Qcm) { qcm.xp++; }
  decrementXp(qcm: Qcm) { if(qcm.xp>0) qcm.xp--; }
  validerXp(qcm: Qcm) { qcm.xp = Math.max(0, qcm.xp); }
  validerQCM() { this.popupQcmOuvert = false; alert('QCM validés !'); }
  trackByIndex(index: number) { return index; }

  ouvrirPopup() { this.popupOuvert = true; }
  fermerPopup() { this.popupOuvert = false; }
  validerAvis() {
    if(!this.prenom || !this.nom || !this.avisMessage){ alert('Remplissez tous les champs'); return; }
    alert(`Merci pour votre avis, ${this.prenom} ${this.nom} !`);
    this.prenom=''; this.nom=''; this.avisMessage=''; this.popupOuvert=false;
  }

  mettreAJourImage() { this.imageMatiere = this.getImageParMatiere(this.matiere); }

  // Méthodes pour le template
  getInitiales() { return this.profileService.getInitiales(); }
  getNomComplet() { return this.profileService.getNomComplet(); }
}
