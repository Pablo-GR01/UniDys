import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cours-detail-p',
  templateUrl: './cours-detail-p.html',
  styleUrls: ['./cours-detail-p.css'],
  standalone: true,
  imports:[CommonModule]
})
export class CoursDetailP implements OnInit {
  contenuHtml: SafeHtml | null = null;
  idCours: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.idCours = this.route.snapshot.paramMap.get('id');
    if (this.idCours) {
      // Appel backend pour récupérer le contenu HTML converti
      this.http.get(`/api/cours/html/${this.idCours}`, { responseType: 'text' }).subscribe({
        next: (html) => {
          // Sécuriser l'HTML avant affichage
          this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(html);
        },
        error: (err) => {
          console.error('Erreur chargement HTML cours', err);
        }
      });
    }
  }
}
