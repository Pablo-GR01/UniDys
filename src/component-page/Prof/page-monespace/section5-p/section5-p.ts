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
  bonnesReponses: boolean[];
  xp: number;
  xpMin?: number;
  xpMax?: number;
}

@Component({
  selector: 'app-section5-p',
  templateUrl: './section5-p.html',
  styleUrls: ['./section5-p.css'],
  standalone: true,
  imports: [Icon, FormsModule, CommonModule]
})
export class Section5P implements OnInit, OnDestroy {

  // -------------------- COURS --------------------
  cours: Cours[] = [];
  coursSelectionne: Cours | null = null;

  // Popups
  popupCoursOuvert = false;
  popupQcmOuvert = false;
  popupOuvert = false;
  showPopupExplique = false;

  // Formulaire cours
  titreCours = '';
  niveau = '';
  matiere = '';
  lienYoutube = '';
  imageMatiere = '';
  fichierPdf?: File;
  qcms: Qcm[] = [];
  messageErreurPdf = '';

  // QCM
  nouvelleQuestion = '';
  nouvellesReponses: string[] = ['',''];
  bonneReponse: boolean[] = [false,false];

  // XP
  xpMin = 10;
  xpMax = 50;

  // Avis
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
    if (!utilisateur.prenom || !utilisateur.nom) return;
    this.nomProf = `${utilisateur.prenom} ${utilisateur.nom}`.trim();
    this.chargerCours();
    this.refreshSub = this.refreshService.refreshRequested$.subscribe(() => this.chargerCours());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
    this.restoreBodyScroll();
  }

  // -------------------- CHARGEMENT COURS --------------------
  chargerCours(): void {
    this.http.get<Cours[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(this.nomProf)}`)
      .subscribe({
        next: data => this.cours = data || [],
        error: err => { console.error(err); this.cours = []; }
      });
  }

  // -------------------- POPUP COURS --------------------
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
    this.blockBodyScroll();
  }

  fermerPopupCours() {
    this.popupCoursOuvert = false;
    this.resetForm();
    this.restoreBodyScroll();
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
    this.nouvelleQuestion = '';
    this.nouvellesReponses = ['',''];
    this.bonneReponse = [false,false];
    this.xpMin = 10;
    this.xpMax = 50;
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
    if (!utilisateur._id) return;

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
      error: err => { console.error(err); alert('Erreur lors de la création du cours.'); }
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

  // -------------------- POPUP QCM --------------------
  ouvrirPopupQCM() {
    this.popupQcmOuvert = true;
    this.nouvelleQuestion = '';
    this.nouvellesReponses = ['',''];
    this.bonneReponse = [false,false];
    this.xpMin = 10;
    this.xpMax = 50;
    this.blockBodyScroll();
  }

  trackByIndex(index: number, item: any): number { return index; }

  ouvrirQCMDepuisCours() {
    this.fermerPopupCours();
    this.ouvrirPopupQCM();
  }

  fermerPopupQCM() {
    this.popupQcmOuvert = false;
    this.restoreBodyScroll();
  }

  ajouterReponsePopup() {
    this.nouvellesReponses.push('');
    this.bonneReponse.push(false);
  }

  supprimerReponsePopup(index: number) {
    this.nouvellesReponses.splice(index,1);
    this.bonneReponse.splice(index,1);
  }

  validerQCM() {
    if (!this.nouvelleQuestion || this.nouvellesReponses.length < 2) {
      alert('Ajoutez une question et au moins 2 réponses.');
      return;
    }
    if (this.xpMin > this.xpMax) { alert('XP min ne peut être supérieur à XP max'); return; }

    this.qcms.push({
      question: this.nouvelleQuestion,
      reponses: [...this.nouvellesReponses],
      bonnesReponses: [...this.bonneReponse],
      xp: this.xpMin,
      xpMin: this.xpMin,
      xpMax: this.xpMax
    });
    this.fermerPopupQCM();
  }

  // -------------------- POPUP AVIS --------------------
  ouvrirPopup() { 
    this.popupOuvert = true; 
    this.blockBodyScroll();
  }

  fermerPopup() { 
    this.popupOuvert = false; 
    this.restoreBodyScroll();
  }

  validerAvis() {
    if(!this.prenom || !this.nom || !this.avisMessage){ 
      alert('Remplissez tous les champs'); 
      return; 
    }
    alert(`Merci pour votre avis, ${this.prenom} ${this.nom} !`);
    this.prenom=''; this.nom=''; this.avisMessage=''; 
    this.popupOuvert=false;
    this.restoreBodyScroll();
  }

  mettreAJourImage() { this.imageMatiere = this.getImageParMatiere(this.matiere); }

  // -------------------- POPUP EXPLICATIF --------------------
  ouvrirPopupexplique() { 
    this.showPopupExplique = true; 
    this.blockBodyScroll();
  }

  fermerPopupexplique() { 
    this.showPopupExplique = false; 
    this.restoreBodyScroll();
  }

  // -------------------- INIT & PROFILE --------------------
  getInitiales() { return this.profileService.getInitiales(); }
  getNomComplet() { return this.profileService.getNomComplet(); }

  // -------------------- XP --------------------
  incrementXp() {
    if (this.xpMax < 50) this.xpMax++;
    if (this.xpMin < this.xpMax) this.xpMin++;
  }

  decrementXp() {
    if (this.xpMin > 10) this.xpMin--;
    if (this.xpMax > this.xpMin) this.xpMax--;
  }

  // -------------------- SCROLL --------------------
  private blockBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  private restoreBodyScroll() {
    if (!this.popupCoursOuvert && !this.popupQcmOuvert && !this.popupOuvert && !this.showPopupExplique) {
      document.body.style.overflow = 'auto';
    }
  }
}
