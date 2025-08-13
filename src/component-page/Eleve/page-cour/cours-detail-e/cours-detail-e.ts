import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderE } from '../../../../component/header-e/header-e';
import { UserService } from '../../../../services/user.service';

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
  imports: [CommonModule, HeaderE, FormsModule, HttpClientModule],
})
export class CoursdetailE implements OnInit {
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

  private apiBase = 'http://localhost:3000';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Récupérer l'ID du cours depuis l'URL
    this.idCours = this.route.snapshot.paramMap.get('id');

    // Récupérer l'ID de l'utilisateur depuis le UserService
    const user = this.userService.getUser();
    this.userId = user?._id || null;

    // Charger le contenu du cours
    this.chargerCours();
  }

  private chargerCours(): void {
    if (!this.idCours) return;

    this.loading = true;
    this.http
      .get<{ html: string; qcm: QcmQuestion[] }>(
        `${this.apiBase}/api/cours/complet/${this.idCours}`
      )
      .subscribe({
        next: ({ html, qcm = [] }) => {
          this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(html);
          this.qcm = qcm;
          this.reponsesUtilisateur = qcm.map(() => null);

          // Si utilisateur connecté, vérifier si QCM déjà fait
          if (this.userId) {
            this.chargerEtatQcm();
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

  private chargerEtatQcm(): void {
    if (!this.userId || !this.idCours) return;

    this.http
      .get<any>(`${this.apiBase}/api/qcm/resultats/${this.idCours}/${this.userId}`)
      .subscribe({
        next: (res) => {
          if (res) {
            this.qcmDejaFait = true;
            this.reponsesSauvegardees = res.reponses || [];
            this.resultat = res.score ?? 0;
            this.xp = res.xpGagne ?? 0;

            // Afficher les réponses précédentes
            this.reponsesUtilisateur = this.reponsesSauvegardees.map(r => r);
          }
          this.loading = false;
        },
        error: () => {
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

  validerQCM(): void {
    if (this.qcmDejaFait) return; // ne peut valider qu'une seule fois

    // Vérifier que toutes les questions ont été répondues
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

    // Sauvegarder immédiatement sur le serveur
    if (this.userId) {
      this.sauvegarderQCM();
    }
  }

  fermerPopup(): void {
    this.showPopup = false;

    // Ajouter XP à l'utilisateur
    if (this.userId && this.xp > 0) {
      this.http
        .post(`${this.apiBase}/api/users/${this.userId}/ajouterXP`, { xp: this.xp })
        .subscribe({
          next: () => console.log('✅ XP ajouté avec succès'),
          error: (err) => console.error('❌ Erreur ajout XP', err),
        });
    }
  }

  private sauvegarderQCM(): void {
    if (!this.userId || !this.idCours) return;

    const reponsesFinales = this.reponsesUtilisateur.filter((r): r is number => r !== null);

    this.http
      .post(`${this.apiBase}/api/qcm/resultats`, {
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

  isBonneReponse(question: QcmQuestion, indexR: number): boolean {
    return indexR === question.bonneReponse;
  }

  get xptotal(): number {
    return this.qcm.reduce((t, q) => t + (q.xp || 0), 0);
  }
}
