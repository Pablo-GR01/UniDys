import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderE } from '../../../../component/header-e/header-e';
import { ProfileService } from '../../../../services/userService/Profile.Service';
import { Subscription } from 'rxjs';

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

@Component({
  selector: 'app-cours-detail-e',
  templateUrl: './cours-detail-e.html',
  styleUrls: ['./cours-detail-e.css'],
  standalone: true,
  imports: [CommonModule, HeaderE, FormsModule, HttpClientModule],
})
export class CoursDetailE implements OnInit, OnDestroy {
  contenuHtml: SafeHtml | null = null;
  qcm: QcmQuestion[] = [];
  cours: Cours | null = null;
  reponsesUtilisateur: (number | null)[] = [];
  reponsesSauvegardees: number[] = [];

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

  // --- contrôle texte et police ---
  texteTaille = 22;
  policeTexte = 'Arial';
  policesDisponibles: string[] = [
    'Arial',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Trebuchet MS',
    'Roboto',
    'Open Sans',
    'Comic Sans MS'
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.idCours = this.route.snapshot.paramMap.get('id');
    const user = this.profileService.getUser();
    this.userId = user?._id || null;

    this.restaurerPreferences();

    if (!this.idCours) {
      this.loading = false;
      return;
    }

    this.chargerCoursEtQcm();
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  private restaurerPreferences(): void {
    const savedTaille = localStorage.getItem('texteTaille');
    if (savedTaille) this.texteTaille = parseInt(savedTaille, 10);

    const savedPolice = localStorage.getItem('policeTexte');
    if (savedPolice) this.policeTexte = savedPolice;
  }

  private chargerCoursEtQcm(): void {
    this.loading = true;

    this.http
      .get<{ html: string; qcm: QcmQuestion[]; coursInfo: Cours }>(
        `${this.apiBase}/cours/complet/${this.idCours}`
      )
      .subscribe({
        next: ({ html, qcm = [], coursInfo }) => {
          this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(html);
          this.qcm = qcm;
          this.cours = coursInfo;

          if (!this.qcmDejaFait) this.reponsesUtilisateur = qcm.map(() => null);

          // Vérifier si l'utilisateur a déjà répondu
          if (this.userId && this.qcm.length > 0) {
            this.http
              .get<any>(`${this.apiBase}/qcm/resultats/${this.idCours}/${this.userId}`)
              .subscribe({
                next: (res) => {
                  if (res) {
                    this.qcmDejaFait = true;
                    this.reponsesSauvegardees = res.reponses || [];
                    this.resultat = res.score ?? 0;
                    this.xp = res.xpGagne ?? 0;
                    this.reponsesUtilisateur = [...this.reponsesSauvegardees];
                  }
                },
                error: () => {}
              });
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur chargement cours:', err);
          this.loading = false;
        }
      });
  }

  // --- contrôles texte ---
  augmenterTexte(): void {
    if (this.texteTaille < 38) {
      this.texteTaille += 2;
      localStorage.setItem('texteTaille', this.texteTaille.toString());
    }
  }

  diminuerTexte(): void {
    if (this.texteTaille > 16) {
      this.texteTaille -= 2;
      localStorage.setItem('texteTaille', this.texteTaille.toString());
    }
  }

  changerPolice(): void {
    localStorage.setItem('policeTexte', this.policeTexte);
  }

  estCoche(indexQ: number, indexR: number): boolean {
    return this.qcmDejaFait
      ? this.reponsesSauvegardees[indexQ] === indexR
      : this.reponsesUtilisateur[indexQ] === indexR;
  }

  questionEstJuste(indexQ: number): boolean {
    return this.reponsesUtilisateur[indexQ] === this.qcm[indexQ]?.bonneReponse;
  }

  isBonneReponse(question: QcmQuestion, indexR: number): boolean {
    return indexR === question.bonneReponse;
  }

  validerQCM(): void {
    if (this.qcmDejaFait) return;

    for (let i = 0; i < this.qcm.length; i++) {
      if (this.reponsesUtilisateur[i] === null) {
        alert(`Réponds à la question ${i + 1}`);
        return;
      }
    }

    let score = 0;
    let xpTotal = 0;
    this.qcm.forEach((q, i) => {
      if (this.reponsesUtilisateur[i] === q.bonneReponse) {
        score++;
        xpTotal += q.xp || 0;
      }
    });

    this.resultat = score;
    this.xp = xpTotal;

    this.message =
      score === this.qcm.length
        ? '🎉 Bravo ! Toutes les réponses sont correctes.'
        : score === 0
        ? '❌ Perdu ! Aucune bonne réponse.'
        : '👍 Bien essayé, mais tu peux faire mieux !';

    this.qcmDejaFait = true;
    this.reponsesSauvegardees = this.reponsesUtilisateur.filter(
      (r): r is number => r !== null
    );
    
    this.showPopup = true;

    this.sauvegarderQCM();
    this.ajouterXPServeur();
  }

  private sauvegarderQCM(): void {
    if (!this.userId || !this.idCours) return;

    const reponsesFinales = this.reponsesUtilisateur.filter((r): r is number => r !== null);

    this.http
      .post(`${this.apiBase}/qcm/resultats`, {
        userId: this.userId,
        qcmId: this.idCours,
        score: this.resultat,
        reponses: reponsesFinales,
        xpGagne: this.xp,
      })
      .subscribe({
        next: () => console.log('✅ Résultats QCM sauvegardés'),
        error: (err) => console.error('❌ Erreur sauvegarde QCM', err)
      });
  }

  private ajouterXPServeur(): void {
    if (!this.userId || this.xp <= 0) return;

    this.http.post<{ updatedXP: number }>(
      `${this.apiBase}/users/${this.userId}/ajouterXP`,
      { xp: this.xp }
    ).subscribe({
      next: (res) => {
        const user = this.profileService.getUser();
        if (user) {
          user.xp = res.updatedXP;
          localStorage.setItem('user', JSON.stringify(user));
        }
      },
      error: (err) => console.error('❌ Erreur ajout XP serveur', err)
    });
  }

  fermerPopup(): void {
    this.showPopup = false;
  }

  get xptotal(): number {
    return this.qcm.reduce((t, q) => t + (q.xp || 0), 0);
  }
}
