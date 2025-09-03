import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderE } from '../../../../component/header-e/header-e';
import { ProfileService } from '../../../../services/userService/Profile.Service';
import { Subscription } from 'rxjs';

// ====================== INTERFACES ======================
interface QcmQuestion {
  question: string;
  reponses: string[];
  bonneReponse: number;
  xp: number;
}

interface Cours {
  titre: string;
  niveau: string;
  matiere: string;
}

interface BoutonAccessibilite {
  label: string;
  icon?: string;
  bgClass: string;
  title: string;
  action: () => void;
}

// ====================== COMPONENT ======================
@Component({
  selector: 'app-cours-detail-e',
  templateUrl: './cours-detail-e.html',
  styleUrls: ['./cours-detail-e.css'],
  standalone: true,
  imports: [CommonModule, HeaderE, FormsModule, HttpClientModule],
})
export class CoursDetailE implements OnInit, OnDestroy {
  // ====================== CONTENU & QCM ======================
  contenuHtml: SafeHtml | null = null;
  qcm: QcmQuestion[] = [];
  cours: Cours | null = null;
  reponsesUtilisateur: (number | null)[] = [];
  reponsesSauvegardees: number[] = [];
  menuSurlignageOuvert = false;

  idCours: string | null = null;
  userId: string | null = null;

  resultat: number | null = null;
  xp = 0;
  message = '';
  loading = true;
  showPopup = false;
  qcmDejaFait = false;

  private apiBase = 'http://localhost:3000/api';
  private refreshSub: Subscription | null = null;

  // ====================== ACCESSIBILITÉ ======================
  texteTaille = 22;
  policeTexte = 'Arial';
  espacement = 0;
  interligne = 1.6;
  modeDys = false;
  themeActuel: 'clair' | 'sombre' = 'clair';

  policesDisponibles: string[] = [
    'Arial', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Trebuchet MS', 'Roboto', 'Open Sans', 'Comic Sans MS'
  ];

  boutonsAccessibilite: BoutonAccessibilite[] = [];

  // ====================== CONSTRUCTOR ======================
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private renderer: Renderer2
  ) {}

  // ====================== LIFECYCLE ======================
  ngOnInit(): void {
    this.idCours = this.route.snapshot.paramMap.get('id');
    const user = this.profileService.getUser();
    this.userId = user?._id || null;

    this.restaurerPreferences();
    this.initialiserBoutonsAccessibilite();

    if (!this.idCours) {
      this.loading = false;
      return;
    }
    this.chargerCoursEtQcm();
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
    window.speechSynthesis.cancel();
  }

  // ====================== INITIALISATION BOUTONS ======================
  private initialiserBoutonsAccessibilite(): void {
    this.boutonsAccessibilite = [
      { label: 'Réduire', icon: 'fas fa-minus text-white',
        bgClass: 'bg-gradient-to-r from-[var(--Bleu)] to-[var(--Violet)]',
        title: 'Réduire la taille du texte', action: () => this.diminuerTexte() },
      { label: 'Agrandir', icon: 'fas fa-plus text-white',
        bgClass: 'bg-gradient-to-r from-[var(--Bleu)] to-[var(--Violet)]',
        title: 'Agrandir la taille du texte', action: () => this.augmenterTexte() },
      { label: 'Police', icon: 'fas fa-font text-white',
        bgClass: 'bg-gradient-to-r from-[var(--Bleu)] to-[var(--Violet)]',
        title: 'Changer la police', action: () => this.changerPolice() },
      { label: 'Espacement', icon: 'fas fa-text-width text-white',
        bgClass: 'bg-gradient-to-r from-[var(--Bleu)] to-[var(--Violet)]',
        title: "Augmenter l'espacement", action: () => { this.espacement += 1; this.changerEspacement(); } },
      // { label: 'Thème', icon: 'fas fa-adjust text-white',
      //   bgClass: 'bg-gradient-to-r from-[var(--Bleu)] to-[var(--Violet)]',
      //   title: 'Basculer clair / sombre', action: () => this.toggleTheme() },
      { label: 'Souligner', icon: 'fas fa-underline text-white',
        bgClass: 'bg-gradient-to-r from-[var(--Bleu)] to-[var(--Violet)]',
        title: 'Souligner le texte', action: () => this.soulignerTexte() },
      { label: 'Réinitialiser', icon: 'fas fa-rotate-right text-white',
        bgClass: 'bg-gradient-to-r from-[var(--Bleu)] to-[var(--Violet)]',
        title: 'Réinitialiser', action: () => this.reinitialiserParams() }
    ];
  }

  // ====================== CHARGEMENT ======================
  private chargerCoursEtQcm(): void {
    this.loading = true;
    this.http.get<{ html: string; qcm: QcmQuestion[]; coursInfo: Cours }>(
      `${this.apiBase}/cours/complet/${this.idCours}`
    ).subscribe({
      next: ({ html, qcm = [], coursInfo }) => {
        this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(html);
        this.qcm = qcm;
        this.cours = coursInfo;
        if (!this.qcmDejaFait) this.reponsesUtilisateur = qcm.map(() => null);
        this.loading = false;
        if (this.userId && this.qcm.length > 0) this.recupererQCMDejaFait();
      },
      error: (err) => { console.error('Erreur chargement cours:', err); this.loading = false; }
    });
  }

  private recupererQCMDejaFait(): void {
    this.http.get<any>(`${this.apiBase}/qcm/resultats/${this.idCours}/${this.userId}`)
      .subscribe({
        next: (res) => {
          if (res) {
            this.qcmDejaFait = true;
            this.reponsesSauvegardees = res.reponses || [];
            this.resultat = res.score ?? 0;
            this.xp = res.xpGagne ?? 0;
            this.reponsesUtilisateur = [...this.reponsesSauvegardees];
          }
        }
      });
  }

  // ====================== ACCESSIBILITÉ ======================
  augmenterTexte(): void { if (this.texteTaille < 38) { this.texteTaille += 2; localStorage.setItem('texteTaille', this.texteTaille.toString()); } }
  diminuerTexte(): void { if (this.texteTaille > 22) { this.texteTaille -= 2; localStorage.setItem('texteTaille', this.texteTaille.toString()); } }
  changerPolice(): void { const i = this.policesDisponibles.indexOf(this.policeTexte); this.policeTexte = this.policesDisponibles[(i + 1) % this.policesDisponibles.length]; localStorage.setItem('policeTexte', this.policeTexte); }
  changerEspacement(): void { localStorage.setItem('espacement', this.espacement.toString()); }
  changerInterligne(): void { localStorage.setItem('interligne', this.interligne.toString()); }
  toggleModeDys(): void { this.modeDys = !this.modeDys; this.policeTexte = this.modeDys ? 'Comic Sans MS' : 'Arial'; localStorage.setItem('modeDys', this.modeDys.toString()); }

  toggleTheme(): void {
    this.themeActuel = this.themeActuel === 'clair' ? 'sombre' : 'clair';
    this.renderer.removeClass(document.body, 'theme-clair');
    this.renderer.removeClass(document.body, 'theme-sombre');
    this.renderer.addClass(document.body, `theme-${this.themeActuel}`);
    localStorage.setItem('theme', this.themeActuel);
  }

  surlignerTexte(couleur: string): void {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = couleur;
    span.style.padding = '2px 4px';
    span.style.borderRadius = '4px';
    range.surroundContents(span);
    selection.removeAllRanges();
  }

  soulignerTexte(): void {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.textDecoration = 'underline';
    range.surroundContents(span);
    selection.removeAllRanges();
  }

  reinitialiserParams(): void {
    this.texteTaille = 22;
    this.policeTexte = 'Arial';
    this.espacement = 0;
    this.interligne = 1.6;
    this.modeDys = false;
    this.themeActuel = 'clair';
    localStorage.clear();
    this.renderer.removeClass(document.body, 'theme-sombre');
    this.renderer.addClass(document.body, 'theme-clair');
  }

  private restaurerPreferences(): void {
    const t = localStorage.getItem('texteTaille'); if (t) this.texteTaille = +t;
    const p = localStorage.getItem('policeTexte'); if (p) this.policeTexte = p;
    const e = localStorage.getItem('espacement'); if (e) this.espacement = +e;
    const i = localStorage.getItem('interligne'); if (i) this.interligne = +i;
    const m = localStorage.getItem('modeDys'); if (m) this.modeDys = m === 'true';
    const th = localStorage.getItem('theme') as 'clair' | 'sombre' | null;
    this.themeActuel = th ?? 'clair';
    this.renderer.addClass(document.body, `theme-${this.themeActuel}`);
  }

  // ====================== QCM ======================
  estCoche(iQ: number, iR: number): boolean { return this.reponsesUtilisateur[iQ] === iR; }
  questionEstJuste(iQ: number): boolean { return this.reponsesUtilisateur[iQ] === this.qcm[iQ]?.bonneReponse; }
  isBonneReponse(q: QcmQuestion, iR: number): boolean { return iR === q.bonneReponse; }

  validerQCM(): void {
    let score = 0; let xpTotal = 0;
    this.qcm.forEach((q, i) => {
      if (this.reponsesUtilisateur[i] === q.bonneReponse) {
        score++; xpTotal += q.xp || 0;
      }
    });
    this.resultat = score;
    this.xp = xpTotal;
    this.sauvegarderQCM();
    this.showPopup = true;
  }

  private sauvegarderQCM(): void {
    if (!this.userId || !this.idCours) return;
    this.http.post(`${this.apiBase}/qcm/resultats`, {
      userId: this.userId,
      coursId: this.idCours,
      reponses: this.reponsesUtilisateur,
      score: this.resultat,
      xpGagne: this.xp,
    }).subscribe();
  }

  fermerPopup(): void { this.showPopup = false; }
  get xptotal(): number { return this.qcm.reduce((t, q) => t + (q.xp || 0), 0); }
}
