import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderP } from "../../../../component/header-p/header-p";
import { FormsModule } from '@angular/forms';

interface QcmQuestion {
  question: string;
  reponses: string[];
  bonnesReponses: number[]; // index des bonnes réponses
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
  reponsesChoisies: number[][] = [];
  resultat: number | null = null;
  message: string = '';
  xp: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.idCours = this.route.snapshot.paramMap.get('id');
    if (this.idCours) {
      this.http.get<{ html: string; qcm: QcmQuestion[] }>(
        `http://localhost:3000/api/cours/complet/${this.idCours}`
      ).subscribe({
        next: (data) => {
          this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(data.html);
          this.qcm = data.qcm || [];
          this.reponsesChoisies = this.qcm.map(() => []);
          this.resultat = null;
          this.message = '';
          this.xp = 0;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du contenu du cours', err);
        }
      });
    }
  }

  estCoche(indexQuestion: number, indexReponse: number): boolean {
    return this.reponsesChoisies[indexQuestion]?.includes(indexReponse) ?? false;
  }

  toggleReponse(indexQuestion: number, indexReponse: number, estCoche: boolean): void {
    if (!this.reponsesChoisies[indexQuestion]) {
      this.reponsesChoisies[indexQuestion] = [];
    }
    const reponses = this.reponsesChoisies[indexQuestion];
    if (estCoche) {
      if (!reponses.includes(indexReponse)) reponses.push(indexReponse);
    } else {
      const pos = reponses.indexOf(indexReponse);
      if (pos > -1) reponses.splice(pos, 1);
    }
  }

  validerQCM(): void {
    let score = 0;
    for (let i = 0; i < this.qcm.length; i++) {
      const bonnes = this.qcm[i].bonnesReponses.slice().sort();
      const choisies = (this.reponsesChoisies[i] || []).slice().sort();
      if (JSON.stringify(bonnes) === JSON.stringify(choisies)) {
        score++;
      }
    }
    this.resultat = score;
    this.xp = score * 10;

    if (score === this.qcm.length) {
      this.message = '🎉 Bravo ! Toutes les réponses sont correctes.';
    } else if (score === 0) {
      this.message = '❌ Perdu ! Aucune bonne réponse.';
    } else {
      this.message = '👍 Bien essayé, mais tu peux faire mieux !';
    }
  }

  questionEstJuste(indexQuestion: number): boolean {
    if (this.resultat === null) return false;
    const bonnes = this.qcm[indexQuestion].bonnesReponses.slice().sort();
    const choisies = (this.reponsesChoisies[indexQuestion] || []).slice().sort();
    return JSON.stringify(bonnes) === JSON.stringify(choisies);
  }

  reinitialiserQCM(): void {
    this.reponsesChoisies = this.qcm.map(() => []);
    this.resultat = null;
    this.message = '';
    this.xp = 0;
  }

  isBonneReponse(question: QcmQuestion | undefined, indexReponse: number): boolean {
    if (!question || !question.bonnesReponses) return false;
    return question.bonnesReponses.includes(indexReponse);
  }
}
