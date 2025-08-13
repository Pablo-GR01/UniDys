import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderP } from "../../../../component/header-p/header-p";
import { FormsModule } from '@angular/forms';

interface QcmQuestion {
  question: string;
  reponses: string[];
  bonnesReponses: number[]; // index des bonnes réponses
}

@Component({
  selector: 'app-cours-detail-p',
  templateUrl: './cours-detail-p.html',
  styleUrls: ['./cours-detail-p.css'],
  standalone: true,
  imports: [CommonModule, HeaderP, FormsModule,HttpClientModule],
})
export class CoursDetailP implements OnInit {
  contenuHtml: SafeHtml | null = null;
  qcm: QcmQuestion[] = [];
  idCours: string | null = null;
  reponsesChoisies: number[][] = [];
  resultat: number | null = null;

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
  }

  isBonneReponse(question: QcmQuestion | undefined, indexReponse: number): boolean {
  if (!question || !question.bonnesReponses) return false;
  return question.bonnesReponses.includes(indexReponse);
}

}
