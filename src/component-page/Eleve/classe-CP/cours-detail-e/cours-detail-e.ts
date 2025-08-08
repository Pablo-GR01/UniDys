import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderP } from '../../../../component/header-p/header-p';
import { FormsModule } from '@angular/forms';

interface QcmQuestion {
  question: string;
  reponses: string[];
  bonnesReponses: number[];
  xp: number;
}

@Component({
  selector: 'app-cours-detail-e',
  templateUrl: './cours-detail-e.html',
  styleUrls: ['./cours-detail-e.css'],
  standalone: true,
  imports: [CommonModule, HeaderP, FormsModule],
})
export class CoursdetailE implements OnInit {
  contenuHtml: SafeHtml | null = null;
  qcm: QcmQuestion[] = [];
  idCours: string | null = null;

  /* QCM à choix UNIQUE : on mémorise l’index de la réponse choisie */
  reponsesUtilisateur: (number | null)[] = [];

  resultat: number | null = null;
  message = '';
  xp = 0;
  loading = true;
  showPopup = false;  // booléen correctement initialisé

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.idCours = this.route.snapshot.paramMap.get('id');
    if (this.idCours) {
      this.loading = true;
      this.http
        .get<{ html: string; qcm: QcmQuestion[] }>(
          `http://localhost:3000/api/cours/complet/${this.idCours}`
        )
        .subscribe({
          next: (data) => {
            this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(data.html);
            this.qcm = data.qcm || [];
            // Initialisation : aucune réponse choisie au départ
            this.reponsesUtilisateur = this.qcm.map(() => null);

            this.resultat = null;
            this.message = '';
            this.xp = 0;
            this.showPopup = false;
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          },
        });
    }
  }

  estCoche(indexQuestion: number, indexReponse: number): boolean {
    return this.reponsesUtilisateur[indexQuestion] === indexReponse;
  }

  validerQCM(): void {
    for (let i = 0; i < this.qcm.length; i++) {
      if (this.reponsesUtilisateur[i] === null) {
        alert(`Réponds à la question ${i + 1}`);
        return;
      }
    }

    let score = 0;
    let xpTotal = 0;

    for (let i = 0; i < this.qcm.length; i++) {
      const bonnes = this.qcm[i].bonnesReponses ?? [];
      const choisie = this.reponsesUtilisateur[i];

      if (bonnes.length === 1 && bonnes[0] === choisie) {
        score++;
        xpTotal += this.qcm[i].xp || 0;
      }
    }

    this.resultat = score;
    this.xp = xpTotal;

    if (score === this.qcm.length) {
      this.message = '🎉 Bravo ! Toutes les réponses sont correctes.';
    } else if (score === 0) {
      this.message = '❌ Perdu ! Aucune bonne réponse.';
    } else {
      this.message = '👍 Bien essayé, mais tu peux faire mieux !';
    }

    this.showPopup = true;
  }

  questionEstJuste(indexQuestion: number): boolean {
    const question = this.qcm[indexQuestion];
    if (!question || !question.bonnesReponses) return false;

    const bonnes = question.bonnesReponses;
    const choisie = this.reponsesUtilisateur[indexQuestion];
    return bonnes.length === 1 && bonnes[0] === choisie;
  }

  isBonneReponse(question: QcmQuestion, indexReponse: number): boolean {
    return question.bonnesReponses?.includes(indexReponse) ?? false;
  }

  get xptotal(): number {
    return this.qcm.reduce((t, q) => t + (q.xp || 0), 0);
  }
}
