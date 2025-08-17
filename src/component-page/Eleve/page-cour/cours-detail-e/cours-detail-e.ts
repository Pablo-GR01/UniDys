import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderE } from '../../../../component/header-e/header-e';
import { ProfileService } from '../../../../services/userService/Profile.Service';

interface QcmQuestion {
  question: string;
  reponses: string[];
  bonneReponse: number;
  xp: number;
}

@Component({
  selector: 'app-cours-detail-e',
  templateUrl: './cours-detail-e.html',
  styleUrls: ['./cours-detail-e.css'],
  standalone: true,
  imports: [CommonModule, HeaderE, FormsModule,HttpClientModule],
})
export class CoursDetailE implements OnInit {
  contenuHtml: SafeHtml | null = null;
  qcm: QcmQuestion[] = [];
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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.idCours = this.route.snapshot.paramMap.get('id');
    const user = this.profileService.getUser();
    this.userId = user?._id || null;

    if (!this.idCours) {
      this.loading = false;
      return;
    }

    this.chargerCoursEtQcm();
  }

  /** Charge le cours et le QCM, puis récupère l'état QCM si user connecté */
  private chargerCoursEtQcm(): void {
    this.loading = true;

    this.http
      .get<{ html: string; qcm: QcmQuestion[] }>(
        `${this.apiBase}/cours/complet/${this.idCours}`
      )
      .subscribe({
        next: ({ html, qcm = [] }) => {
          this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(html);
          this.qcm = qcm;
          this.reponsesUtilisateur = qcm.map(() => null);

          // Si utilisateur connecté et QCM existant, charger les réponses sauvegardées
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
                    this.reponsesUtilisateur = this.reponsesSauvegardees.map((r) => r);
                  }
                  this.loading = false;
                },
                error: () => {
                  this.loading = false;
                },
              });
          } else {
            this.loading = false;
          }
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  estCoche(indexQ: number, indexR: number): boolean {
    return this.qcmDejaFait
      ? this.reponsesSauvegardees[indexQ] === indexR
      : this.reponsesUtilisateur[indexQ] === indexR;
  }

  questionEstJuste(indexQ: number): boolean {
    if (this.resultat === null) return false;
    return this.reponsesUtilisateur[indexQ] === this.qcm[indexQ]?.bonneReponse;
  }

  isBonneReponse(question: QcmQuestion, indexR: number): boolean {
    return indexR === question.bonneReponse;
  }

  get xptotal(): number {
    return this.qcm.reduce((t, q) => t + (q.xp || 0), 0);
  }

  validerQCM(): void {
    if (this.qcmDejaFait) return;

    // Vérification que toutes les questions ont une réponse
    for (let i = 0; i < this.qcm.length; i++) {
      if (this.reponsesUtilisateur[i] === null) {
        alert(`Réponds à la question ${i + 1}`);
        return;
      }
    }

    // Calcul score et XP
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

    if (this.userId) this.sauvegarderQCM();
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
        error: (err) => console.error('❌ Erreur sauvegarde QCM', err),
      });
  }

  fermerPopup(): void {
    this.showPopup = false;
    if (this.userId && this.xp > 0) {
      this.profileService.ajouterXP(this.xp);

      this.http
        .post(`${this.apiBase}/users/${this.userId}/ajouterXP`, { xp: this.xp })
        .subscribe({ next: () => {}, error: console.error });
    }
  }
}
